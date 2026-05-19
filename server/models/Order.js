const mongoose = require('mongoose')

const statusEntrySchema = new mongoose.Schema({
  status:    { type: String, required: true },
  note:      { type: String, default: '' },
  changedAt: { type: Date,   default: Date.now },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  orderId:             { type: String, required: true, unique: true, index: true },
  senderName:          { type: String, required: true, trim: true },
  senderEmail:         { type: String, required: true, trim: true, lowercase: true },
  senderPhone:         { type: String, required: true, trim: true },
  recipientName:       { type: String, required: true, trim: true },
  recipientEmail:      { type: String, trim: true, lowercase: true, default: '' },
  occasion:            { type: String, required: true },
  letterCollection:    { type: String, required: true },
  tier:                { type: String, enum: ['scribe', 'designer'], required: true },
  serviceType:         { type: String, enum: ['digital', 'physical'], required: true },
  message:             { type: String, required: true },
  deliveryDate:        { type: Date },
  addons:              { type: [String], default: [] },
  specialInstructions: { type: String, default: '' },
  deliveryAddress:     { type: String, default: '' },
  paymentProofUrl:     { type: String, default: '' },
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
