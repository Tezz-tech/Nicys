import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'
import InkDivider from '../components/ui/InkDivider'
import WaxSeal    from '../components/ui/WaxSeal'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } }
const vp   = { once: false, amount: 0.2 }

const STEPS = ['Received', 'In Progress', 'Complete', 'Delivered']

const STEP_COLORS = {
  Received:      { seal: '#D4A5A5', label: 'Received'     },
  'In Progress': { seal: '#C8A4D4', label: 'In Progress'  },
  Complete:      { seal: '#8B1A2E', label: 'Complete'     },
  Delivered:     { seal: '#1B2A4A', label: 'Delivered'    },
}

function StatusTimeline({ currentStatus }) {
  const idx = STEPS.indexOf(currentStatus)
  return (
    <div className="flex items-start mt-8 mb-12">
      {STEPS.map((step, i) => {
        const done   = i <= idx
        const active = i === idx
        return (
          <div key={step} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-px transition-colors duration-700 ${done ? 'bg-lavender' : 'bg-midnight/12'}`}
                style={{ transform: 'translateX(-50%)' }}
              />
            )}

            {/* Node */}
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all duration-500 ${
                active
                  ? 'bg-lavender text-midnight shadow-lg shadow-lavender/30 scale-110'
                  : done
                  ? 'bg-emerald text-cream'
                  : 'bg-cream border-2 border-midnight/15 text-midnight/30'
              }`}
            >
              {done && !active ? '✓' : i + 1}
              {active && (
                <span className="absolute inset-0 rounded-full border-2 border-lavender animate-ping opacity-30" />
              )}
            </motion.div>

            <p className={`font-body text-[9px] tracking-widest uppercase font-semibold mt-2.5 text-center ${
              active ? 'text-lavender' : done ? 'text-emerald' : 'text-midnight/25'
            }`}>
              {step}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default function Track() {
  const [form, setForm]     = useState({ email: '', orderId: '' })
  const [order, setOrder]   = useState(null)
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email.includes('@'))  e.email   = 'Enter a valid email address.'
    if (!form.orderId.trim())       e.orderId = 'Enter your order reference number.'
    return e
  }

  const track = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStatus('loading')
    try {
      const { data } = await api.get(`/api/orders/${form.orderId.trim()}`, {
        params: { email: form.email.trim() },
      })
      setOrder(data)
      setStatus('found')
    } catch (err) {
      setStatus(err.response?.status === 404 ? 'notfound' : 'error')
    }
  }

  const reset = () => { setStatus('idle'); setOrder(null); setForm({ email: '', orderId: '' }) }

  return (
    <motion.div {...fade}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 md:px-16 sepia-section relative overflow-hidden">
        {/* Postmark stamp decoration */}
        <div className="absolute top-16 right-12 opacity-10 pointer-events-none" aria-hidden>
          <div className="stamp w-32 h-32 border-midnight/30 flex-col text-center gap-0.5">
            <p className="font-body text-[8px] tracking-widest uppercase text-midnight leading-tight font-semibold">Nicys</p>
            <p className="font-display text-xs italic text-midnight">Abuja</p>
            <p className="font-body text-[8px] tracking-widest uppercase text-midnight">{new Date().getFullYear()}</p>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 font-display text-[20rem] font-bold text-midnight/[0.018] pointer-events-none select-none leading-none" aria-hidden>T</div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-7"
          >
            <div className="w-8 h-px bg-lavender" />
            <span className="section-label text-lavender">Order Tracking</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.95 }}
            className="font-display text-6xl md:text-7xl font-semibold text-midnight leading-[0.9] text-shadow-ink"
          >
            Where is<br /><em className="italic text-lavender">your letter?</em>
          </motion.h1>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="max-w-xl mx-auto">

          {/* ── Lookup form ── */}
          {status !== 'found' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <form onSubmit={track} noValidate className="letter-card p-8 bg-cream ruled-bg space-y-6">
                {/* Letterhead */}
                <div className="pb-4 border-b border-midnight/8">
                  <span className="font-display text-sm italic text-midnight/30">Track your order</span>
                </div>

                <div>
                  <label className="form-label">Email Address Used to Order</label>
                  <input
                    type="email" className="form-input"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                  />
                  {errors.email && <p className="font-body text-xs font-medium text-dusty-rose mt-1.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="form-label">Order Reference Number</label>
                  <input
                    type="text" className="form-input font-body tracking-wider font-semibold"
                    placeholder="NCY-XXXXXXXX"
                    value={form.orderId}
                    onChange={(e) => { setForm(p => ({ ...p, orderId: e.target.value.toUpperCase() })); setErrors(p => ({ ...p, orderId: '' })) }}
                  />
                  {errors.orderId && <p className="font-body text-xs font-medium text-dusty-rose mt-1.5">{errors.orderId}</p>}
                  <p className="font-body text-xs font-medium text-midnight/35 mt-2">
                    Your reference number was included in your confirmation email.
                  </p>
                </div>

                {status === 'notfound' && (
                  <div className="p-4 border border-dusty-rose/30 bg-dusty-rose/5">
                    <p className="font-body text-sm font-medium text-midnight/70">
                      No order found with those details. Please double-check your reference number and email.
                    </p>
                  </div>
                )}
                {status === 'error' && (
                  <p className="font-body text-xs font-medium text-dusty-rose">
                    Something went wrong. Please try again or contact us on WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {status === 'loading' ? 'Looking up your order…' : 'Track My Order →'}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── Order found ── */}
          {status === 'found' && order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="section-label text-midnight/50">Order Status</span>
                <motion.div
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                >
                  <WaxSeal
                    size={52}
                    color={STEP_COLORS[order.status]?.seal || '#C8A4D4'}
                    letter={order.status[0]}
                  />
                </motion.div>
              </div>

              <StatusTimeline currentStatus={order.status} />

              {/* Status History — shown when admin has left notes */}
              {order.statusHistory?.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="letter-card bg-cream p-6 mb-8"
                >
                  <h4 className="font-body text-xs font-semibold tracking-widest uppercase text-midnight/50 mb-4">
                    Order Updates
                  </h4>
                  <div className="space-y-3">
                    {[...order.statusHistory].reverse().map((entry, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-lavender mt-1.5 shrink-0" />
                        <div>
                          <p className="font-body text-xs font-semibold tracking-widest uppercase text-midnight/60 mb-0.5">
                            {entry.status}
                          </p>
                          {entry.note && (
                            <p className="font-body text-sm text-midnight/70">{entry.note}</p>
                          )}
                          <p className="font-body text-xs text-midnight/30 mt-0.5">
                            {new Date(entry.changedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Order summary card */}
              <div className="letter-card bg-cream p-8 space-y-4 ruled-bg mb-8">
                <div className="flex items-center justify-between pb-4 border-b border-midnight/8">
                  <h3 className="font-display text-2xl font-semibold text-midnight">Your Order</h3>
                  <span className="font-display text-xs italic text-midnight/30">Nicys Studio</span>
                </div>

                {[
                  { label: 'Reference',          value: order.orderId },
                  { label: 'Collection',         value: order.letterCollection },
                  { label: 'Recipient',          value: order.recipientName },
                  { label: 'Service Type',       value: order.serviceType === 'physical' ? 'Physical Gift Box' : 'Digital Letter' },
                  { label: 'Estimated Delivery', value: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To be confirmed' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start border-b border-midnight/5 pb-3.5 last:border-0">
                    <span className="form-label mb-0">{label}</span>
                    <span className="font-body text-sm font-semibold text-midnight text-right max-w-[55%]">{value}</span>
                  </div>
                ))}
              </div>

              <button onClick={reset} className="btn-ghost text-midnight/50">
                ← Track another order
              </button>
            </motion.div>
          )}

          <InkDivider className="mt-16" />
        </div>
      </section>
    </motion.div>
  )
}
