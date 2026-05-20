import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'

const TIERS = [
  {
    value:   'designer',
    label:   "I have my own words ready!",
    sub:     "The Designer's Tier",
    icon:    '◈',
    desc:    "You've already written your heart out. Our team will perform a light Polishing & Grammar Check to ensure your message shines perfectly in its new home.",
    accent:  '#800000',
  },
  {
    value:   'scribe',
    label:   "I need the Scribe to find the words for me.",
    sub:     "The Scribe's Tier",
    icon:    '✦',
    desc:    "You share the memories, the feelings you can't quite name, the story behind the person. We find the words — beautifully, precisely, with warmth that lands.",
    accent:  '#E8A0B4',
  },
]

export default function Step2Collection() {
  const { orderData, updateOrder, nextStep, prevStep } = useOrder()
  const { tier } = orderData
  const canProceed = Boolean(tier)

  return (
    <div>
      <h2 className="font-display text-3xl font-light text-midnight mb-1">
        Will you be providing your own written message?
      </h2>
      <p className="font-body text-sm text-midnight/50 mb-10 leading-relaxed">
        Or would you like our Scribe to write it for you?
      </p>

      <div className="grid md:grid-cols-2 gap-5 mb-12">
        {TIERS.map((t) => {
          const selected = tier === t.value
          return (
            <motion.button
              key={t.value}
              onClick={() => updateOrder({ tier: t.value })}
              whileHover={{ y: -3 }}
              whileTap={{ y: 0 }}
              className={`text-left p-8 border-2 transition-all duration-250 focus:outline-none rounded-sm ${
                selected
                  ? 'border-lavender bg-lavender/8'
                  : 'border-midnight/12 hover:border-lavender/45'
              }`}
              style={{
                boxShadow: selected
                  ? '0 8px 28px rgba(128,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.55)'
                  : '0 3px 12px rgba(13,27,56,0.06), inset 0 1px 0 rgba(255,255,255,0.65)',
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <span className="text-2xl" style={{ color: t.accent }}>{t.icon}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selected ? 'border-lavender bg-lavender' : 'border-midnight/20'
                  }`}
                >
                  {selected && <span className="text-[9px] text-midnight font-bold">✓</span>}
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold text-midnight mb-1 leading-snug">{t.label}</h3>
              <p className="font-body text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: t.accent }}>{t.sub}</p>
              <p className="font-body text-sm text-midnight/55 leading-relaxed">{t.desc}</p>
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-between">
        <button onClick={prevStep} className="btn-ghost">← Back</button>
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
