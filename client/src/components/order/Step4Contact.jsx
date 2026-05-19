import { useState, useRef } from 'react'
import axios from 'axios'
import { useOrder } from '../../context/OrderContext'

const BANK_DETAILS = {
  bank:    'First Bank of Nigeria',
  account: '3012345678',
  name:    'Nicys Creative Studio',
}

export default function Step4Contact() {
  const { orderData, updateOrder, nextStep, prevStep, setOrderId, setSubmitting, submitting } = useOrder()
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const isPhysical = orderData.serviceType === 'physical'

  const handle = (field) => (ev) => {
    updateOrder({ [field]: ev.target.value })
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  const handleFile = (ev) => {
    const file = ev.target.files[0]
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors(p => ({ ...p, paymentProof: 'File must be under 5MB.' }))
      return
    }
    updateOrder({ paymentProof: file || null })
    if (errors.paymentProof) setErrors(p => ({ ...p, paymentProof: '' }))
  }

  const validate = () => {
    const e = {}
    if (!orderData.senderName.trim())  e.senderName  = 'Your name is required.'
    if (!orderData.senderEmail.includes('@')) e.senderEmail = 'A valid email is required.'
    if (!orderData.senderPhone.trim()) e.senderPhone = 'Your phone number is required.'
    if (!orderData.recipientEmail.includes('@') && !isPhysical) e.recipientEmail = 'A valid recipient email is required.'
    if (isPhysical && !orderData.deliveryAddress.trim()) e.deliveryAddress = 'Delivery address is required for physical orders.'
    return e
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    setSubmitting(true)
    try {
      const formData = new FormData()
      // Append all order data
      Object.entries(orderData).forEach(([key, value]) => {
        if (key === 'addons') {
          formData.append(key, JSON.stringify(value))
        } else if (key !== 'paymentProof') {
          formData.append(key, value || '')
        }
      })
      if (orderData.paymentProof) {
        formData.append('paymentProof', orderData.paymentProof)
      }

      const { data } = await axios.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setOrderId(data.orderId)
      nextStep()
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="font-display text-4xl font-light text-midnight mb-2">Your details & payment</h2>
      <p className="font-body text-sm text-midnight/55 mb-10">Almost there — just a few last details.</p>

      <div className="space-y-8">
        {/* Sender info */}
        <div>
          <h3 className="font-display text-xl text-midnight mb-5 pb-3 border-b border-midnight/8">Your Information</h3>
          <div className="space-y-5">
            <div>
              <label className="form-label">Your Full Name *</label>
              <input type="text" className="form-input" placeholder="Jane Doe"
                value={orderData.senderName} onChange={handle('senderName')} />
              {errors.senderName && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.senderName}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Your Email *</label>
                <input type="email" className="form-input" placeholder="jane@example.com"
                  value={orderData.senderEmail} onChange={handle('senderEmail')} />
                {errors.senderEmail && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.senderEmail}</p>}
              </div>
              <div>
                <label className="form-label">Your Phone Number *</label>
                <input type="tel" className="form-input" placeholder="+234 800 000 0000"
                  value={orderData.senderPhone} onChange={handle('senderPhone')} />
                {errors.senderPhone && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.senderPhone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div>
          <h3 className="font-display text-xl text-midnight mb-5 pb-3 border-b border-midnight/8">Delivery Details</h3>
          <div className="space-y-5">
            {!isPhysical && (
              <div>
                <label className="form-label">Recipient's Email Address *</label>
                <p className="font-body text-xs text-midnight/40 mb-2">
                  We'll send the digital letter here.
                </p>
                <input type="email" className="form-input" placeholder="recipient@example.com"
                  value={orderData.recipientEmail} onChange={handle('recipientEmail')} />
                {errors.recipientEmail && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.recipientEmail}</p>}
              </div>
            )}
            {isPhysical && (
              <div>
                <label className="form-label">Delivery Address *</label>
                <p className="font-body text-xs text-midnight/40 mb-2">
                  Physical deliveries are within Abuja only.
                </p>
                <textarea rows={3} className="form-input resize-none" placeholder="Full delivery address, Abuja"
                  value={orderData.deliveryAddress} onChange={handle('deliveryAddress')} />
                {errors.deliveryAddress && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.deliveryAddress}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Payment */}
        <div>
          <h3 className="font-display text-xl text-midnight mb-5 pb-3 border-b border-midnight/8">Payment</h3>

          <div className="p-6 bg-cream-dark border border-lavender/20 mb-6">
            <p className="font-body text-[10px] tracking-widest uppercase text-lavender mb-4">Bank Transfer Details</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-midnight/50">Bank</span>
                <span className="font-body text-sm text-midnight font-medium">{BANK_DETAILS.bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-midnight/50">Account Number</span>
                <span className="font-body text-sm text-midnight font-medium tracking-widest">{BANK_DETAILS.account}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-xs text-midnight/50">Account Name</span>
                <span className="font-body text-sm text-midnight font-medium">{BANK_DETAILS.name}</span>
              </div>
            </div>
            <p className="font-body text-xs text-midnight/45 mt-4 leading-relaxed">
              Please use your name and occasion as the payment reference.
              Your order will be confirmed once payment is verified.
            </p>
          </div>

          {/* Proof of payment upload */}
          <div>
            <label className="form-label">Upload Proof of Payment (optional but recommended)</label>
            <div
              className="border-2 border-dashed border-midnight/15 p-8 text-center cursor-pointer hover:border-lavender/40 transition-colors duration-200"
              onClick={() => fileRef.current?.click()}
            >
              {orderData.paymentProof ? (
                <div>
                  <p className="font-body text-sm text-emerald mb-1">✓ {orderData.paymentProof.name}</p>
                  <p className="font-body text-xs text-midnight/40">
                    {(orderData.paymentProof.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-body text-sm text-midnight/50 mb-1">Click to upload screenshot</p>
                  <p className="font-body text-xs text-midnight/35">PNG, JPG, PDF — max 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFile}
            />
            {errors.paymentProof && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.paymentProof}</p>}
          </div>
        </div>

        {/* No refunds notice */}
        <div className="p-4 border border-midnight/8 bg-cream-dark">
          <p className="font-body text-xs text-midnight/55 leading-relaxed">
            <strong>Please note:</strong> No refunds are offered due to the deeply personalised nature of our
            work. By submitting this order, you agree to our Terms & Conditions.
          </p>
        </div>

        {errors.submit && (
          <p className="font-body text-sm text-dusty-rose">{errors.submit}</p>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={prevStep} disabled={submitting} className="btn-ghost">← Back</button>
        <button
          onClick={submit}
          disabled={submitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting your order…' : 'Place My Order →'}
        </button>
      </div>
    </div>
  )
}
