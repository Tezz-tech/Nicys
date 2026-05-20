const Order      = require('../models/Order')
const cloudinary = require('../config/cloudinary')
const { sendOrderEmails } = require('../utils/email')
const { v4: uuidv4 } = require('uuid')

function generateOrderId() {
  return `NCY-${uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase()}`
}

async function uploadToCloudinary(buffer, folder, resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => err ? reject(err) : resolve(result.secure_url)
    ).end(buffer)
  })
}

/** POST /api/orders */
exports.createOrder = async (req, res) => {
  try {
    const {
      collection, recipientName, recipientEmail,
      tier, format, designerMessage,
      littleThings, coreMemory, unspoken,
      signature, deliveryDate,
      senderName, senderEmail, senderPhone,
      deliveryAddress,
    } = req.body

    if (!collection || !recipientName || !tier || !senderName || !senderEmail || !senderPhone) {
      return res.status(400).json({ message: 'Missing required order fields.' })
    }

    // Build a legacy 'message' summary for backward compat
    let message = ''
    if (tier === 'designer') {
      message = designerMessage || ''
    } else {
      const parts = []
      if (littleThings) parts.push(`[Little Things] ${littleThings}`)
      if (coreMemory)   parts.push(`[Core Memory] ${coreMemory}`)
      if (unspoken)     parts.push(`[Unspoken] ${unspoken}`)
      message = parts.join('\n\n')
    }

    // Upload letter images to Cloudinary
    const letterImages = []
    for (const file of (req.files?.letterImages || [])) {
      try {
        const url = await uploadToCloudinary(file.buffer, 'nicys/letter-images')
        letterImages.push(url)
      } catch (uploadErr) {
        console.error('[Cloudinary Image Upload Error]', uploadErr.message)
      }
    }

    // Upload payment proof to Cloudinary
    let paymentProofUrl = ''
    const proofFile = req.files?.paymentProof?.[0]
    if (proofFile) {
      try {
        paymentProofUrl = await uploadToCloudinary(proofFile.buffer, 'nicys/payment-proofs')
      } catch (uploadErr) {
        console.error('[Cloudinary Proof Upload Error]', uploadErr.message)
      }
    }

    const order = await Order.create({
      orderId:           generateOrderId(),
      senderName:        senderName.trim(),
      senderEmail:       senderEmail.trim().toLowerCase(),
      senderPhone:       senderPhone.trim(),
      recipientName:     recipientName.trim(),
      recipientEmail:    recipientEmail?.trim() || '',
      letterCollection:  collection,
      tier,
      format:            format || '',
      designerMessage:   designerMessage?.trim() || '',
      littleThings:      littleThings?.trim() || '',
      coreMemory:        coreMemory?.trim() || '',
      unspoken:          unspoken?.trim() || '',
      message,
      signature:         signature?.trim() || '',
      deliveryDate:      deliveryDate ? new Date(deliveryDate) : undefined,
      deliveryAddress:   deliveryAddress?.trim() || '',
      letterImages,
      paymentProofUrl,
      statusHistory:     [{ status: 'Received', note: 'Order placed', changedAt: new Date() }],
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

    const order = await Order.findOne({ orderId: id.toUpperCase() }).select('-__v')
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

/** PATCH /api/orders/:id/status */
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

/** GET /api/orders — public list */
exports.listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const filter = status ? { status } : {}
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-message -designerMessage -littleThings -coreMemory -unspoken -__v')
    const total = await Order.countDocuments(filter)
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to list orders.' })
  }
}
