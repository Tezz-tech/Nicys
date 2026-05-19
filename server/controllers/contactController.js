const Contact = require('../models/Contact')
const { sendContactEmail } = require('../utils/email')

/**
 * POST /api/contact
 */
exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, email, and message are required.' })
    }
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address.' })
    }
    if (message.trim().length < 5) {
      return res.status(400).json({ message: 'Message is too short.' })
    }

    const contact = await Contact.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      message: message.trim(),
    })

    sendContactEmail(contact).catch(err =>
      console.error('[Email Error] Contact email failed:', err.message)
    )

    res.status(201).json({ message: 'Message received. We\'ll be in touch soon.' })
  } catch (err) {
    console.error('[Contact]', err)
    res.status(500).json({ message: 'Failed to send message.' })
  }
}
