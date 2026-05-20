import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../lib/api'
import InkDivider from '../components/ui/InkDivider'
import WaxSeal    from '../components/ui/WaxSeal'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } }
const vp   = { once: false, amount: 0.2 }

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name    = 'Your name is required.'
    if (!form.email.includes('@'))        e.email   = 'A valid email is required.'
    if (form.message.trim().length < 10) e.message = 'Please write at least 10 characters.'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStatus('sending')
    try {
      await api.post('/api/contact', form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch { setStatus('error') }
  }

  const handle = (field) => (ev) => {
    setForm(p => ({ ...p, [field]: ev.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }))
  }

  return (
    <motion.div {...fade}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 md:px-16 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(200,164,212,0.5) 40px)', backgroundSize: '100% 40px' }} />
        <div className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 75% 50%, #C8A4D4 0%, transparent 55%)' }} />
        <div className="absolute right-0 bottom-0 font-display text-[18rem] font-bold text-cream/[0.025] pointer-events-none select-none leading-none" aria-hidden>C</div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-7"
          >
            <div className="w-8 h-px bg-lavender/60" />
            <span className="section-label text-lavender">Get In Touch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.95 }}
            className="font-display text-6xl md:text-7xl font-semibold text-cream leading-[0.9] text-shadow-ink"
          >
            Let's talk<br /><em className="italic text-lavender">about your letter.</em>
          </motion.h1>
        </div>
      </section>

      {/* ── MAIN CONTACT SECTION ─────────────────────────────────────── */}
      <section className="section-padding sepia-section">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">

          {/* ── Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={vp}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Reach Us</span>
            </div>

            <div className="space-y-8">
              {/* WhatsApp */}
              <div className="group letter-card p-6 bg-cream transition-shadow duration-300 hover:shadow-md">
                <p className="form-label mb-3">WhatsApp (Primary)</p>
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald/10 border border-emerald/30 flex items-center justify-center text-emerald font-semibold group-hover:bg-emerald group-hover:text-cream transition-all duration-300 text-sm">
                    WA
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-midnight group-hover:text-emerald transition-colors">+234 800 000 0000</p>
                    <p className="font-body text-xs font-medium text-midnight/40">Tap to open WhatsApp</p>
                  </div>
                </a>
              </div>

              {/* Instagram */}
              <div className="group letter-card p-6 bg-cream transition-shadow duration-300 hover:shadow-md">
                <p className="form-label mb-3">Instagram</p>
                <a
                  href="https://instagram.com/nicys.ng"
                  target="_blank" rel="noreferrer"
                  className="flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-full bg-lavender/10 border border-lavender/30 flex items-center justify-center text-lavender font-semibold group-hover:bg-lavender group-hover:text-cream transition-all duration-300 text-xs">
                    IG
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-midnight group-hover:text-lavender transition-colors">@nicys.ng</p>
                    <p className="font-body text-xs font-medium text-midnight/40">DMs are always open</p>
                  </div>
                </a>
              </div>

              {/* Email */}
              <div className="group letter-card p-6 bg-cream transition-shadow duration-300 hover:shadow-md">
                <p className="form-label mb-3">Email</p>
                <a href="mailto:nicysletters@gmail.com" className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-dusty-rose/10 border border-dusty-rose/30 flex items-center justify-center text-dusty-rose font-semibold group-hover:bg-dusty-rose group-hover:text-cream transition-all duration-300 text-xs">
                    @
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-midnight group-hover:text-dusty-rose transition-colors">nicysletters@gmail.com</p>
                    <p className="font-body text-xs font-medium text-midnight/40">We reply within 24 hours</p>
                  </div>
                </a>
              </div>

              {/* Hours */}
              <div className="letter-card p-6 bg-cream">
                <p className="form-label mb-3">Working Hours</p>
                <div className="flex items-center gap-4">
                  <WaxSeal size={40} color="#2D6A4F" letter="✦" />
                  <div>
                    <p className="font-display text-xl font-semibold text-midnight">7:00 AM – 11:00 PM</p>
                    <p className="font-body text-xs font-medium text-midnight/45 mt-0.5">Available every day of the week</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/2348000000000?text=Hi%20Nicys!%20I%20would%20like%20to%20know%20more%20about%20your%20letter%20writing%20services."
                target="_blank" rel="noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                <span>Chat on WhatsApp</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>

          {/* ── Contact form ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={vp}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Send a Message</span>
            </div>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 px-8 letter-card bg-cream"
              >
                <WaxSeal size={64} color="#2D6A4F" letter="✦" className="mx-auto mb-7" />
                <h3 className="font-display text-3xl font-semibold text-midnight mb-3">Message received.</h3>
                <p className="font-body text-sm font-medium text-midnight/55 leading-relaxed">
                  Thank you for reaching out. We'll be in touch within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6 letter-card p-8 bg-cream ruled-bg">
                {/* Ruled paper header */}
                <div className="flex items-center gap-3 mb-2 pb-4 border-b border-midnight/8">
                  <span className="font-display text-sm italic text-midnight/30">To: Nicys Studio</span>
                </div>

                <div>
                  <label className="form-label">Your Name</label>
                  <input type="text" className="form-input" placeholder="Jane Doe"
                    value={form.name} onChange={handle('name')} />
                  {errors.name && <p className="font-body text-xs font-medium text-dusty-rose mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="jane@example.com"
                    value={form.email} onChange={handle('email')} />
                  {errors.email && <p className="font-body text-xs font-medium text-dusty-rose mt-1.5">{errors.email}</p>}
                </div>

                <div>
                  <label className="form-label">Your Message</label>
                  <textarea
                    rows={6}
                    className="form-input resize-none"
                    placeholder="Tell us what's on your mind…"
                    value={form.message}
                    onChange={handle('message')}
                  />
                  {errors.message && <p className="font-body text-xs font-medium text-dusty-rose mt-1.5">{errors.message}</p>}
                </div>

                {status === 'error' && (
                  <p className="font-body text-xs font-medium text-dusty-rose">
                    Something went wrong. Please try again or contact us via WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message →'}
                </button>

                <p className="font-body text-[11px] text-center font-medium text-midnight/30 italic">
                  We respond within 24 hours
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <InkDivider className="bg-sepia px-16 py-8 bg-cream" />
    </motion.div>
  )
}
