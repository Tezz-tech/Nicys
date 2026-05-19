import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'

const OPTIONS = [
  {
    value: 'digital',
    label: 'Digital Letter',
    icon: '✦',
    desc: 'A beautifully designed letter delivered digitally — a high-resolution PDF sent straight to your inbox or your recipient\'s.',
    details: ['Delivered via email', 'Print-ready PDF included', 'Delivered in 3–5 business days'],
    accent: '#C8A4D4',
  },
  {
    value: 'physical',
    label: 'Physical Gift Box',
    icon: '◈',
    desc: 'A curated luxury box hand-delivered to your door — your letter nestled with baked treats, candles, and beautifully pressed extras.',
    details: ['Abuja delivery only', 'Luxury box & packaging', 'Allow 5–7 business days'],
    accent: '#D4A5A5',
  },
]

export default function Step1Service() {
  const { orderData, updateOrder, nextStep } = useOrder()

  const select = (value) => {
    updateOrder({ serviceType: value })
  }

  const canProceed = Boolean(orderData.serviceType)

  return (
    <div>
      <h2 className="font-display text-4xl font-light text-midnight mb-2">Choose your service</h2>
      <p className="font-body text-sm text-midnight/55 mb-10 leading-relaxed">
        How would you like your letter delivered?
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {OPTIONS.map((opt) => {
          const selected = orderData.serviceType === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`text-left p-8 border-2 transition-all duration-300 focus:outline-none ${
                selected
                  ? 'border-lavender bg-lavender/5 shadow-md'
                  : 'border-midnight/12 hover:border-lavender/40'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-2xl" style={{ color: opt.accent }}>{opt.icon}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    selected ? 'border-lavender bg-lavender' : 'border-midnight/25'
                  }`}
                >
                  {selected && <span className="text-[10px] text-midnight">✓</span>}
                </div>
              </div>
              <h3 className="font-display text-2xl font-medium text-midnight mb-3">{opt.label}</h3>
              <p className="font-body text-sm text-midnight/60 leading-relaxed mb-6">{opt.desc}</p>
              <ul className="space-y-2">
                {opt.details.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 font-body text-xs text-midnight/50">
                    <span className="w-3 h-px" style={{ background: opt.accent }} />
                    {d}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={!canProceed}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
