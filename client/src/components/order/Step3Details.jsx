import { useState } from 'react'
import { useOrder } from '../../context/OrderContext'
import { ADDONS, OCCASIONS } from '../../data/collections'

function getMinDate() {
  const d = new Date()
  // Add 3 business days
  let added = 0
  while (added < 3) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) added++
  }
  return d.toISOString().split('T')[0]
}

export default function Step3Details() {
  const { orderData, updateOrder, nextStep, prevStep } = useOrder()
  const [errors, setErrors] = useState({})

  const handle = (field) => (ev) => {
    updateOrder({ [field]: ev.target.value })
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  const toggleAddon = (id) => {
    const next = orderData.addons.includes(id)
      ? orderData.addons.filter(a => a !== id)
      : [...orderData.addons, id]
    updateOrder({ addons: next })
  }

  const validate = () => {
    const e = {}
    if (!orderData.recipientName.trim()) e.recipientName = 'Recipient name is required.'
    if (!orderData.occasion)             e.occasion       = 'Please select an occasion.'
    if (orderData.message.trim().length < 20) e.message  = 'Please share at least 20 characters about your story.'
    if (!orderData.deliveryDate)         e.deliveryDate   = 'Please choose a delivery date.'
    if (!orderData.tier)                 e.tier           = 'Please choose a service tier.'
    return e
  }

  const proceed = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    nextStep()
  }

  return (
    <div>
      <h2 className="font-display text-4xl font-light text-midnight mb-2">Letter details</h2>
      <p className="font-body text-sm text-midnight/55 mb-10">Help us understand your story.</p>

      <div className="space-y-8">
        {/* Recipient name */}
        <div>
          <label className="form-label">Recipient's Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Who is this letter for?"
            value={orderData.recipientName}
            onChange={handle('recipientName')}
          />
          {errors.recipientName && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.recipientName}</p>}
        </div>

        {/* Occasion */}
        <div>
          <label className="form-label">Occasion *</label>
          <select
            className="form-input bg-cream"
            value={orderData.occasion}
            onChange={handle('occasion')}
          >
            <option value="">Select an occasion…</option>
            {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {errors.occasion && <p className="font-body text-xs text-dusty-rose mt-1.5">{errors.occasion}</p>}
        </div>

        {/* Message / Story */}
        <div>
          <label className="form-label">Your Story / Message *</label>
          <p className="font-body text-xs text-midnight/40 mb-2">
            Share memories, feelings, details about the recipient — anything that should be woven into the letter.
          </p>
          <textarea
            rows={7}
            className="form-input resize-none"
            placeholder="Tell us everything. The more you share, the more authentic and personal your letter will be…"
            value={orderData.message}
            onChange={handle('message')}
          />
          <p className="font-body text-xs text-midnight/35 mt-1 text-right">{orderData.message.length} characters</p>
          {errors.message && <p className="font-body text-xs text-dusty-rose mt-1">{errors.message}</p>}
        </div>

        {/* Delivery date */}
        <div>
          <label className="form-label">Desired Delivery Date *</label>
          <input
            type="date"
            className="form-input"
            min={getMinDate()}
            value={orderData.deliveryDate}
            onChange={handle('deliveryDate')}
          />
          <p className="font-body text-xs text-midnight/40 mt-1.5">Minimum 3 business days from today.</p>
          {errors.deliveryDate && <p className="font-body text-xs text-dusty-rose mt-1">{errors.deliveryDate}</p>}
        </div>

        {/* Tier */}
        <div>
          <label className="form-label">Service Tier *</label>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: 'scribe',   label: "Scribe's Tier",   sub: 'We write it for you',    price: 'From ₦15,000' },
              { value: 'designer', label: "Designer's Tier", sub: 'You write, we design it', price: 'From ₦8,000'  },
            ].map((tier) => (
              <button
                key={tier.value}
                onClick={() => { updateOrder({ tier: tier.value }); setErrors(p => ({ ...p, tier: '' })) }}
                className={`text-left p-5 border-2 transition-all duration-200 ${
                  orderData.tier === tier.value
                    ? 'border-lavender bg-lavender/5'
                    : 'border-midnight/12 hover:border-lavender/35'
                }`}
              >
                <h4 className="font-display text-base font-medium text-midnight mb-0.5">{tier.label}</h4>
                <p className="font-body text-xs text-midnight/50 mb-2">{tier.sub}</p>
                <p className="font-body text-xs text-lavender">{tier.price}</p>
              </button>
            ))}
          </div>
          {errors.tier && <p className="font-body text-xs text-dusty-rose mt-2">{errors.tier}</p>}
        </div>

        {/* Add-ons */}
        <div>
          <label className="form-label">Boosters & Add-ons (optional)</label>
          <div className="grid md:grid-cols-3 gap-4">
            {ADDONS.map((addon) => {
              const active = orderData.addons.includes(addon.id)
              return (
                <button
                  key={addon.id}
                  onClick={() => toggleAddon(addon.id)}
                  className={`text-left p-4 border transition-all duration-200 ${
                    active
                      ? 'border-lavender bg-lavender/5'
                      : 'border-midnight/12 hover:border-lavender/30'
                  }`}
                >
                  <p className="font-body text-[9px] tracking-widest uppercase text-lavender mb-1">{addon.category}</p>
                  <span className="text-lg block mb-1">{addon.icon}</span>
                  <h5 className="font-display text-sm font-medium text-midnight mb-1">{addon.name}</h5>
                  <p className="font-body text-xs text-lavender">{addon.price}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Special instructions */}
        <div>
          <label className="form-label">Special Instructions (optional)</label>
          <textarea
            rows={3}
            className="form-input resize-none"
            placeholder="Anything else we should know — tone, words to avoid, specific references…"
            value={orderData.specialInstructions}
            onChange={handle('specialInstructions')}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={prevStep} className="btn-ghost">← Back</button>
        <button onClick={proceed} className="btn-primary">Continue →</button>
      </div>
    </div>
  )
}
