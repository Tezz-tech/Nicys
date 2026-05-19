import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import InkDivider from '../components/ui/InkDivider'
import WaxSeal    from '../components/ui/WaxSeal'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } }

const HOW_IT_WORKS = [
  { step: '01', label: 'Share your story',     desc: 'Tell us about the person, the memory, the feeling. No detail is too intimate, too small, or too complicated.' },
  { step: '02', label: 'We craft your words',  desc: 'Our writer shapes your story into a letter — every sentence deliberate, every word chosen with precision and care.' },
  { step: '03', label: 'Review & refine',      desc: 'You review the draft and request any adjustments. We work until every word feels exactly right.' },
  { step: '04', label: 'Delivered beautifully', desc: 'Your letter is styled, sealed, and delivered — as a digital masterpiece or in a luxury physical gift box.' },
]

const vp = { once: false, amount: 0.25 }

export default function Services() {
  return (
    <motion.div {...fade}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="min-h-[60vh] flex items-end bg-midnight relative overflow-hidden pt-28 pb-24 px-6 md:px-16">
        {/* Ruled lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(200,164,212,0.5) 40px)', backgroundSize: '100% 40px' }} />
        {/* Glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 85% 40%, #C8A4D4 0%, transparent 55%)' }} />
        {/* Large decorative letter */}
        <div className="absolute right-0 bottom-0 font-display text-[22rem] font-bold text-cream/[0.03] pointer-events-none select-none leading-none" aria-hidden>S</div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex items-center gap-4 mb-7"
          >
            <div className="w-8 h-px bg-lavender/60" />
            <span className="section-label text-lavender">How We Work</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.95 }}
            className="font-display text-6xl md:text-7xl font-semibold text-cream leading-[0.9] text-shadow-ink"
          >
            Two tiers of craft,<br />one standard of<br />
            <em className="italic text-lavender">excellence.</em>
          </motion.h1>
        </div>
      </section>

      {/* ── SERVICE CARDS ────────────────────────────────────────────── */}
      <section className="section-padding sepia-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-24">

            {/* Scribe's Tier */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85 }}
              viewport={vp}
              className="letter-card p-10 md:p-14 flex flex-col bg-cream hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex items-start justify-between mb-10">
                <WaxSeal size={56} color="#C8A4D4" letter="S" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase font-semibold text-lavender border border-lavender/35 px-3 py-1.5">
                  Scribe's Tier
                </span>
              </div>

              <h2 className="font-display text-4xl font-semibold text-midnight mb-3">
                I craft the narrative for you.
              </h2>
              <div className="w-10 h-px bg-lavender mb-7" />

              <p className="font-body text-sm font-medium text-midnight/65 leading-relaxed mb-8">
                You share the memories, the feelings, the story behind the person. We translate
                all of that into language that lands precisely — warm, honest, and unforgettably yours.
                Perfect for those who feel the depth of what they want to say but struggle to find the words.
              </p>

              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'One-on-one story consultation',
                  'Full letter writing (150 – 600+ words)',
                  'Up to 2 rounds of revision',
                  'Digital delivery in 3–5 business days',
                  'Optional physical presentation upgrade',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm font-medium text-midnight/70">
                    <span className="text-lavender mt-0.5 text-[10px] font-bold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Ruled paper decorative lines */}
              <div className="mb-8 space-y-2 opacity-30">
                {[1,2,3].map(i => <div key={i} className="h-px bg-lavender/60" />)}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-midnight/10">
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase font-semibold text-midnight/40 mb-1">Starting from</p>
                  <p className="font-display text-3xl font-semibold text-midnight">₦15,000</p>
                </div>
                <Link to="/order" className="btn-primary text-xs py-3 px-6">Choose This Tier →</Link>
              </div>
            </motion.div>

            {/* Designer's Tier */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.85 }}
              viewport={vp}
              className="letter-card p-10 md:p-14 flex flex-col bg-cream hover:shadow-xl transition-shadow duration-500"
              style={{ '--corner-color': '#D4A5A5' }}
            >
              <div className="flex items-start justify-between mb-10">
                <WaxSeal size={56} color="#D4A5A5" letter="D" />
                <span className="font-body text-[10px] tracking-[0.3em] uppercase font-semibold text-dusty-rose border border-dusty-rose/35 px-3 py-1.5">
                  Designer's Tier
                </span>
              </div>

              <h2 className="font-display text-4xl font-semibold text-midnight mb-3">
                You bring the words; we make them beautiful.
              </h2>
              <div className="w-10 h-px bg-dusty-rose mb-7" />

              <p className="font-body text-sm font-medium text-midnight/65 leading-relaxed mb-8">
                You've already written it. Now let us give your words the visual life they deserve.
                We transform your draft into a beautifully styled, printed, or digitally rendered
                letter — layout, typography, and presentation, perfected.
              </p>

              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'Beautiful typographic layout',
                  'Elegant print or digital styling',
                  'Brand-aligned colour palette',
                  'Delivery in 1–2 business days',
                  'High-resolution PDF + print-ready files',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm font-medium text-midnight/70">
                    <span className="text-dusty-rose mt-0.5 text-[10px] font-bold">◆</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mb-8 space-y-2 opacity-30">
                {[1,2,3].map(i => <div key={i} className="h-px bg-dusty-rose/60" />)}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-midnight/10">
                <div>
                  <p className="font-body text-[10px] tracking-widest uppercase font-semibold text-midnight/40 mb-1">Starting from</p>
                  <p className="font-display text-3xl font-semibold text-midnight">₦8,000</p>
                </div>
                <Link to="/order" className="btn-primary text-xs py-3 px-6">Choose This Tier →</Link>
              </div>
            </motion.div>
          </div>

          {/* ── How it works ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={vp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">The Process</span>
              <div className="w-8 h-px bg-lavender" />
            </div>
            <h2 className="section-heading">How a Nicys letter<br />comes to life.</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.65 }}
                viewport={vp}
                className="text-center group"
              >
                <div className="font-display text-5xl font-semibold text-lavender/25 mb-4 group-hover:text-lavender/50 transition-colors duration-500">{step.step}</div>
                <div className="w-8 h-px bg-lavender mx-auto mb-4" />
                <h4 className="font-display text-xl font-semibold text-midnight mb-3">{step.label}</h4>
                <p className="font-body text-sm font-medium text-midnight/55 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <InkDivider />
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="section-padding bg-cream">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={vp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Questions</span>
              <div className="w-8 h-px bg-lavender" />
            </div>
            <h2 className="font-display text-5xl font-semibold text-midnight">Frequently asked.</h2>
          </motion.div>

          <div className="space-y-0">
            {[
              { q: 'How far in advance should I order?', a: 'We recommend ordering at least 3 business days before your desired delivery date. For physical gift boxes, please allow 5–7 business days.' },
              { q: 'Do you deliver outside Abuja?', a: 'Physical deliveries are currently available within Abuja only. Digital letters can be sent anywhere in the world.' },
              { q: 'What if I want changes to my letter?', a: "Scribe's Tier includes up to 2 rounds of revisions. We work with you until every word feels right — because your letter deserves to be perfect." },
              { q: 'Is my story kept confidential?', a: 'Absolutely. Everything you share is strictly confidential and used solely to craft your letter. We will never share, reference, or repurpose your story.' },
              { q: 'Can I request a specific writing style?', a: 'Yes — formal, poetic, playful, deeply emotional. Let us know during checkout and we\'ll match the tone exactly to your intent.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.65 }}
                viewport={vp}
                className="border-b border-midnight/10 py-8 group"
              >
                <h4 className="font-display text-xl font-semibold text-midnight mb-3 group-hover:text-lavender transition-colors duration-300">{item.q}</h4>
                <p className="font-body text-sm font-medium text-midnight/60 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={vp}
            className="text-center mt-16"
          >
            <Link to="/order" className="btn-primary">Start Your Letter →</Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
