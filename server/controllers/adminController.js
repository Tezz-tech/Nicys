const jwt     = require('jsonwebtoken')
const Order   = require('../models/Order')
const Contact = require('../models/Contact')

/** POST /api/admin/login */
exports.login = (req, res) => {
  const { email, password } = req.body
  if (
    email?.trim().toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase() ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
}

/** GET /api/admin/stats */
exports.getStats = async (req, res) => {
  try {
    const [total, received, inProgress, complete, delivered] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Received' }),
      Order.countDocuments({ status: 'In Progress' }),
      Order.countDocuments({ status: 'Complete' }),
      Order.countDocuments({ status: 'Delivered' }),
    ])
    const recent = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderId senderName recipientName status createdAt tier serviceType')
    res.json({ total, received, inProgress, complete, delivered, recent })
  } catch (err) {
    console.error('[Admin Stats]', err)
    res.status(500).json({ message: 'Failed to load stats.' })
  }
}

/** GET /api/admin/orders?page=1&limit=20&status=&search= */
exports.listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query
    const filter = {}
    if (status) filter.status = status
    if (search) {
      const re = new RegExp(search.trim(), 'i')
      filter.$or = [{ orderId: re }, { senderName: re }, { recipientName: re }, { senderEmail: re }]
    }
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select('-__v'),
      Order.countDocuments(filter),
    ])
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[Admin List Orders]', err)
    res.status(500).json({ message: 'Failed to list orders.' })
  }
}

/** GET /api/admin/orders/:id */
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id.toUpperCase() }).select('-__v')
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order.' })
  }
}

/** PATCH /api/admin/orders/:id/status */
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body
    const VALID = ['Received', 'In Progress', 'Complete', 'Delivered']
    if (!VALID.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid: ${VALID.join(', ')}` })
    }
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id.toUpperCase() },
      {
        status,
        $push: { statusHistory: { status, note: note?.trim() || '', changedAt: new Date() } },
      },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found.' })
    res.json(order)
  } catch (err) {
    console.error('[Admin Update Status]', err)
    res.status(500).json({ message: 'Failed to update status.' })
  }
}

/** GET /api/admin/contacts?page=1&limit=30 */
exports.listContacts = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query
    const [contacts, total] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Contact.countDocuments(),
    ])
    res.json({ contacts, total, page: Number(page), pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ message: 'Failed to list contacts.' })
  }
}
