const Order      = require('../models/Order')
const cloudinary = require('../config/cloudinary')
const { sendOrderEmails } = require('../utils/email')
const { v4: uuidv4 } = require('uuid')

function generateOrderId() {
  return `NCY-${uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'nicys/payment-proofs', resource_type: 'auto' },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    ).end(buffer)
  })
}

/** POST /api/orders */
exports.createOrder = async (req, res) => {
  try {
    const {
      serviceType, collection, recipientName, recipientEmail,
      occasion, message, deliveryDate, tier, specialInstructions,
      senderName, senderEmail, senderPhone, deliveryAddress,
    } = req.body

    if (!serviceType || !collection || !recipientName || !occasion || !message || !tier || !senderName || !senderEmail || !senderPhone) {
      return res.status(400).json({ message: 'Missing required order fields.' })
    }

    let addons = []
    try { addons = JSON.parse(req.body.addons || '[]') } catch { /* ignore */ }

    let paymentProofUrl = ''
    if (req.file) {
      try {
        paymentProofUrl = await uploadToCloudinary(req.file.buffer)
      } catch (uploadErr) {
        console.error('[Cloudinary Upload Error]', uploadErr.message)
      }
    }

    const order = await Order.create({
      orderId:            generateOrderId(),
      serviceType,
      letterCollection:   collection,
      recipientName:      recipientName.trim(),
      recipientEmail:     recipientEmail?.trim() || '',
      occasion,
      message:            message.trim(),
      deliveryDate:       deliveryDate ? new Date(deliveryDate) : undefined,
      tier,
      addons,
      specialInstructions: specialInstructions?.trim() || '',
      senderName:         senderName.trim(),
      senderEmail:        senderEmail.trim().toLowerCase(),
      senderPhone:        senderPhone.trim(),
      deliveryAddress:    deliveryAddress?.trim() || '',
      paymentProofUrl,
      statusHistory:      [{ status: 'Received', note: 'Order placed', changedAt: new Date() }],
    })

    sendOrderEmails(order).catch(err =>
      console.error('[Email Error] Order emails failed:', err.message)
    )

    res.status(201).json({
      orderId: order.orderId,
      status:  order.status,
      message: 'Order created successfully.',
    })
  } catch (err) {
    console.error('[Create Order]', err)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate order ID. Please try again.' })
    }
    res.status(500).json({ message: 'Failed to create order.' })
  }
}

/** GET /api/orders/:id */
exports.getOrder = async (req, res) => {
  try {
    const { id }    = req.params
    const { email } = req.query

    const order = await Order.findOne({ orderId: id.toUpperCase() }).select('-__v -paymentProofUrl')
    if (!order) return res.status(404).json({ message: 'Order not found.' })

    if (email && order.senderEmail !== email.trim().toLowerCase()) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    res.json(order)
  } catch (err) {
    console.error('[Get Order]', err)
    res.status(500).json({ message: 'Failed to fetch order.' })
  }
}

/** PATCH /api/orders/:id/status — kept for backward compat, now delegates to admin */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const VALID = ['Received', 'In Progress', 'Complete', 'Delivered']
    if (!VALID.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid: ${VALID.join(', ')}` })
    }
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id.toUpperCase() },
      { status, $push: { statusHistory: { status, changedAt: new Date() } } },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json({ orderId: order.orderId, status: order.status })
  } catch (err) {
    console.error('[Update Status]', err)
    res.status(500).json({ message: 'Failed to update order status.' })
  }
}

/** GET /api/orders — public list (limited fields) */
exports.listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = status ? { status } : {}
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-message -specialInstructions -paymentProofUrl -__v')
    const total = await Order.countDocuments(filter)
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to list orders.' })
  }
}
