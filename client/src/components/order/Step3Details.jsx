import { useState } from 'react'
import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'

const FORMATS_DESIGNER = [
  { id: 'pocket-hug',          label: 'Pocket Hug',          type: 'PDF',          price: '₦3,000'  },
  { id: 'heartfelt-heirloom',  label: 'Heartfelt Heirloom',  type: 'PDF',          price: '₦6,500'  },
  { id: 'cinematic-scribe',    label: 'Cinematic Scribe',     type: 'Video Letter', price: '₦11,000' },
]

const FORMATS_SCRIBE = [
  { id: 'pocket-hug',          label: 'Pocket Hug',          type: 'PDF',          price: '₦5,000'  },
  { id: 'heartfelt-heirloom',  label: 'Heartfelt Heirloom',  type: 'PDF',          price: '₦8,000'  },
  { id: 'cinematic-scribe',    label: 'Cinematic Scribe',     type: 'Video Letter', price: '₦15,000' },
]

function FormatPicker({ formats, selected, onSelect, error }) {
  return (
    <div>
      <label className="form-label">How should your story be told? *</label>
      <p className="font-body text-xs text-midnight/40 mb-4">
        Check my highlights for more information on each tier.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {formats.map((f) => {
          const isSelected = selected === f.id
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f.id)}
              className={`text-left p-5 border-2 transition-all duration-200 rounded-sm focus:outline-none ${
                isSelected
                  ? 'border-lavender bg-lavender/8'
                  : 'border-midnight/12 hover:border-lavender/45'
              }`}
              style={{
                boxShadow: isSelected
                  ? '0 6px 20px rgba(196,168,240,0.20), inset 0 1px 0 rgba(255,255,255,0.55)'
                  : '0 2px 8px rgba(13,27,56,0.05), inset 0 1px 0 rgba(255,255,255,0.60)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-body text-[9px] tracking-widest uppercase text-lavender font-semibold">{f.type}</span>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-lavender bg-lavender' : 'border-midnight/20'}`}>
                  {isSelected && <span className="text-[8px] text-midnight font-bold">✓</span>}
                </div>
              </div>
              <h4 className="font-display text-base font-semibold text-midnight mb-1">{f.label}</h4>
              <p className="font-body text-sm text-lavender font-semibold">{f.price}</p>
            </button>
          )
        })}
      </div>
      {error && <p className="font-body text-xs text-dusty-rose mt-2">{error}</p>}
    </div>
  )
}

export default function Step3Details() {
  const { orderData, updateOrder, nextStep, prevStep } = useOrder()
  const { tier, designerMessage, littleThings, coreMemory, unspoken, format } = orderData
  const [errors, setErrors] = useState({})

  const handle = (field) => (ev) => {
    updateOrder({ [field]: ev.target.value })
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (tier === 'designer') {
      if (designerMessage.trim().length < 20)
        e.designerMessage = 'Please paste at least 20 characters of your message.'
    } else {
      if (!littleThings.trim()) e.littleThings = 'Please share at least one little thing.'
      if (!coreMemory.trim())   e.coreMemory   = 'Please describe your core memory.'
      if (!unspoken.trim())     e.unspoken     = 'Please share what you\'d say in 30 seconds.'
    }
    if (!format) e.format = 'Please choose how your story should be told.'
    return e
  }

  const proceed = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    nextStep()
  }

  const formats = tier === 'designer' ? FORMATS_DESIGNER : FORMATS_SCRIBE

  return (
    <div>
      {tier === 'designer' ? (
        <>
          <h2 className="font-display text-3xl font-light text-midnight mb-2">Designer's Tier</h2>

          {/* Designer note */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 border border-lavender/25 bg-lavender/5 rounded-sm"
          >
            <p className="font-body text-xs text-midnight/60 leading-relaxed italic">
              Note: If you provide your own words, our team will still perform a light 'Polishing & Grammar Check' to ensure your message shines perfectly in its new home.
            </p>
          </motion.div>

          <div className="space-y-8">
            <div>
              <label className="form-label">Paste your masterpiece here *</label>
              <textarea
                rows={9}
                className="form-input resize-none"
                placeholder="Your words are already beautiful. Let us give them the home they deserve…"
                value={designerMessage}
                onChange={handle('designerMessage')}
              />
              <p className="font-body text-xs text-midnight/35 mt-1 text-right">{designerMessage.length} characters</p>
              {errors.designerMessage && <p className="font-body text-xs text-dusty-rose mt-1">{errors.designerMessage}</p>}
            </div>

            <FormatPicker
              formats={formats}
              selected={format}
              onSelect={(id) => { updateOrder({ format: id }); setErrors(p => ({ ...p, format: '' })) }}
              error={errors.format}
            />
          </div>
        </>
      ) : (
        <>
          <h2 className="font-display text-3xl font-light text-midnight mb-2">Scribe's Tier</h2>
          <p className="font-body text-sm text-midnight/50 mb-10 leading-relaxed">
            Your stories are the ink. Let me find the words.
          </p>

          <div className="space-y-8">
            <div>
              <label className="form-label">The "Little Things" *</label>
              <p className="font-body text-xs text-midnight/45 mb-2 leading-relaxed">
                What is a small habit they have that you secretly love?
              </p>
              <textarea
                rows={4}
                className="form-input resize-none"
                placeholder="The way they tap their fingers when they're thinking, the sound of their laugh on a quiet morning…"
                value={littleThings}
                onChange={handle('littleThings')}
              />
              {errors.littleThings && <p className="font-body text-xs text-dusty-rose mt-1">{errors.littleThings}</p>}
            </div>

            <div>
              <label className="form-label">The Core Memory *</label>
              <p className="font-body text-xs text-midnight/45 mb-2 leading-relaxed">
                Describe one specific moment, place, or inside joke that defines your bond.
              </p>
              <textarea
                rows={5}
                className="form-input resize-none"
                placeholder="The night we stayed up until 3am talking about nothing and everything. The look on their face when…"
                value={coreMemory}
                onChange={handle('coreMemory')}
              />
              {errors.coreMemory && <p className="font-body text-xs text-dusty-rose mt-1">{errors.coreMemory}</p>}
            </div>

            <div>
              <label className="form-label">The Unspoken *</label>
              <p className="font-body text-xs text-midnight/45 mb-2 leading-relaxed">
                If you had only 30 seconds to tell them how you feel, what would you say?
              </p>
              <textarea
                rows={4}
                className="form-input resize-none"
                placeholder="I'd want them to know that…"
                value={unspoken}
                onChange={handle('unspoken')}
              />
              {errors.unspoken && <p className="font-body text-xs text-dusty-rose mt-1">{errors.unspoken}</p>}
            </div>

            <FormatPicker
              formats={formats}
              selected={format}
              onSelect={(id) => { updateOrder({ format: id }); setErrors(p => ({ ...p, format: '' })) }}
              error={errors.format}
            />
          </div>
        </>
      )}

      <div className="flex justify-between mt-10">
        <button onClick={prevStep} className="btn-ghost">← Back</button>
        <button onClick={proceed} className="btn-primary">Continue →</button>
      </div>
    </div>
  )
}
