import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'

const COLLECTIONS = [
  { id: 'lavender-longing',  name: 'Lavender and Longing',  desc: 'For my love who is far away.',                          accent: '#C4A8F0' },
  { id: 'midnight-letter',   name: 'Midnight Letter',        desc: 'For an intimate, moody, and deep expression of love.',   accent: '#0D1B38' },
  { id: 'century-of-love',   name: 'Century of Love',        desc: 'For our Anniversary (celebrating the years).',           accent: '#E8A0B4' },
  { id: 'year-of-heartfelt', name: 'A Year of Heartfelt',   desc: 'For a beautiful Birthday.',                              accent: '#FFC1D0' },
  { id: 'grace-lavender',    name: 'Grace and Lavender',     desc: 'Just thinking of you / Sympathy.',                      accent: '#C4A8F0' },
  { id: 'note-of-a-note',    name: 'A Note of a Note',       desc: 'For my mentor, boss, or colleague.',                    accent: '#8B1A2E' },
  { id: 'sunshine-script',   name: 'Sunshine Script',        desc: 'For a friend who needs a smile today.',                 accent: '#D4A820' },
  { id: 'velvet-vanilla',    name: 'Velvet and Vanilla',     desc: 'My Valentine (Special Edition).',                       accent: '#E8A0B4' },
]

export default function Step1Service() {
  const { orderData, updateOrder, nextStep } = useOrder()
  const { collection, recipientName } = orderData

  const canProceed = Boolean(collection && recipientName.trim())

  return (
    <div>
      {/* Confidentiality notice */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 p-5 border border-lavender/30 bg-lavender/5 rounded-sm"
        style={{ boxShadow: 'inset 0 1px 0 rgba(196,168,240,0.2)' }}
      >
        <p className="font-body text-xs text-midnight/65 leading-relaxed italic">
          Every story deserves to be told. To help me weave your heart into a letter, please share a few whispers with me.
        </p>
        <p className="font-body text-[10px] text-midnight/45 leading-relaxed mt-3">
          <strong className="text-midnight/60 not-italic">Your stories are safe in my hands.</strong> At Nicys, confidentiality is our foundation. I am the only person who reads your brief and writes your letter. Your personal stories are never shared, and all drafts are digitally shredded once your order is delivered. Your trust is as sacred as the ink on the page.
        </p>
      </motion.div>

      {/* Occasion / Collection */}
      <div className="mb-10">
        <h2 className="font-display text-3xl font-light text-midnight mb-1">What's the Occasion?</h2>
        <p className="font-body text-sm text-midnight/50 mb-6 leading-relaxed">Choose Your Vibe — The Collection</p>

        <div className="grid sm:grid-cols-2 gap-3">
          {COLLECTIONS.map((c) => {
            const selected = collection === c.id
            return (
              <button
                key={c.id}
                onClick={() => updateOrder({ collection: c.id })}
                className={`text-left p-5 border-2 transition-all duration-250 focus:outline-none rounded-sm ${
                  selected
                    ? 'border-lavender bg-lavender/8 shadow-lavender'
                    : 'border-midnight/10 hover:border-lavender/50'
                }`}
                style={{
                  borderLeft: selected ? undefined : `3px solid ${c.accent}`,
                  boxShadow: selected
                    ? '0 4px 18px rgba(196,168,240,0.20), inset 0 1px 0 rgba(255,255,255,0.6)'
                    : '0 2px 8px rgba(13,27,56,0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-3">
                    <h3 className="font-display text-base font-semibold text-midnight mb-1">{c.name}</h3>
                    <p className="font-body text-xs text-midnight/55 leading-relaxed">{c.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                      selected ? 'border-lavender bg-lavender' : 'border-midnight/20'
                    }`}
                  >
                    {selected && <span className="text-[9px] text-midnight font-bold">✓</span>}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recipient name */}
      <div className="mb-10">
        <label className="form-label">Recipient's Name or Nickname *</label>
        <input
          type="text"
          className="form-input"
          placeholder="Who is this letter for?"
          value={recipientName}
          onChange={(e) => updateOrder({ recipientName: e.target.value })}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="btn-primary disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
