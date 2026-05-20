const mongoose = require('mongoose')

const statusEntrySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  note:      { type: String, default: '' },
  changedAt: { type: Date,   default: Date.now },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderId:            { type: String, required: true, unique: true, index: true },

  // Sender
  senderName:         { type: String, required: true, trim: true },
  senderEmail:        { type: String, required: true, trim: true, lowercase: true },
  senderPhone:        { type: String, required: true, trim: true },

  // Recipient
  recipientName:      { type: String, required: true, trim: true },
  recipientEmail:     { type: String, trim: true, lowercase: true, default: '' },

  // Order identity
  letterCollection:   { type: String, required: true },
  tier:               { type: String, enum: ['scribe', 'designer'], required: true },
  format:             { type: String, enum: ['pocket-hug', 'heartfelt-heirloom', 'cinematic-scribe'], default: '' },

  // Content — designer path
  designerMessage:    { type: String, default: '' },

  // Content — scribe path
  littleThings:       { type: String, default: '' },
  coreMemory:         { type: String, default: '' },
  unspoken:           { type: String, default: '' },

  // Legacy combined message field (kept for backward compat)
  message:            { type: String, default: '' },

  // Final details
  signature:          { type: String, default: '' },
  deliveryDate:       { type: Date },
  deliveryAddress:    { type: String, default: '' },

  // Uploaded files (Cloudinary URLs)
  letterImages:       { type: [String], default: [] },
  paymentProofUrl:    { type: String, default: '' },

  // Status
  status: {
    type:    String,
    enum:    ['Received', 'In Progress', 'Complete', 'Delivered'],
    default: 'Received',
  },
  statusHistory: { type: [statusEntrySchema], default: [] },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Order', orderSchema)
