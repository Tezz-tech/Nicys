import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLLECTIONS, GIFT_BOXES, ADDONS } from '../data/collections'
import InkDivider from '../components/ui/InkDivider'
import WaxSeal    from '../components/ui/WaxSeal'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } }
const vp   = { once: false, amount: 0.2 }

function CollectionCard({ c, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: i * 0.07, duration: 0.65 }}
      viewport={vp}
      className="group relative flex flex-col bg-cream letter-card hover:shadow-lg transition-all duration-500 overflow-hidden"
      style={{ borderTop: `3px solid ${c.mood}` }}
    >
      {/* Mood-tinted shimmer overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${c.mood}10 0%, transparent 70%)` }}
      />

      {/* Large watermark letter */}
      <div
        className="absolute top-2 right-3 font-display text-5xl font-bold pointer-events-none select-none opacity-[0.05] leading-none"
        style={{ color: c.mood }}
        aria-hidden
      >
        {c.name[0]}
      </div>

      <div className="p-8 flex flex-col flex-1 relative z-10">
        <div className="flex items-start justify-between mb-5">
          <span
            className="font-body text-[10px] tracking-[0.25em] uppercase font-semibold px-2.5 py-1"
            style={{
              background: `${c.mood}22`,
              color: c.mood === '#FFF0C0' ? '#8a7830' : c.mood,
            }}
          >
            {c.tag}
          </span>
          <span className="font-body text-[10px] font-medium text-midnight/30 tracking-wide">{c.occasion}</span>
        </div>

        <h3 className="font-display text-2xl font-semibold text-midnight mb-3 group-hover:text-lavender transition-colors duration-300">
          {c.name}
        </h3>
        <div className="w-6 h-px mb-4" style={{ background: c.mood }} />
        <p className="font-body text-sm font-medium text-midnight/60 leading-relaxed mb-6 flex-1">{c.desc}</p>

        <div className="flex items-center justify-end pt-5 border-t border-midnight/8">
          <Link
            to={`/order?collection=${c.id}`}
            className="font-body text-[11px] tracking-widest uppercase font-semibold text-midnight/45 hover:text-lavender transition-colors group-hover:translate-x-1 inline-block transition-transform duration-300"
          >
            Order →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Packages() {
  return (
    <motion.div {...fade}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 md:px-16 sepia-section relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C8A4D4, transparent)' }}
        />
        {/* Big watermark */}
        <div className="absolute left-0 bottom-0 font-display text-[20rem] font-bold text-midnight/[0.018] pointer-events-none select-none leading-none" aria-hidden>C</div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-7"
          >
            <div className="w-8 h-px bg-lavender" />
            <span className="section-label text-lavender">Our Collections</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.95 }}
            className="font-display text-6xl md:text-7xl font-semibold text-midnight leading-[0.9] text-shadow-ink"
          >
            Letters for<br />every chapter<br />
            <em className="italic text-lavender">of your life.</em>
          </motion.h1>
        </div>
      </section>

      {/* ── COLLECTIONS GRID ─────────────────────────────────────────── */}
      <section className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {COLLECTIONS.map((c, i) => <CollectionCard key={c.id} c={c} i={i} />)}
          </div>
        </div>
      </section>

      <InkDivider className="bg-cream px-16 pb-4" />

      {/* ── GIFT BOXES ───────────────────────────────────────────────── */}
      <section className="section-padding bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(200,164,212,0.5) 40px)', backgroundSize: '100% 40px' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(200,164,212,0.07), transparent 60%)' }} />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={vp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-lavender/50" />
              <span className="section-label text-lavender">Gift Boxes</span>
              <div className="w-8 h-px bg-lavender/50" />
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-cream text-shadow-ink">
              Luxury, unboxed.
            </h2>
            <p className="font-body text-sm font-medium text-cream/45 max-w-lg mx-auto mt-6">
              When words alone aren't enough — send an experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {GIFT_BOXES.map((box, i) => (
              <motion.div
                key={box.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.75 }}
                viewport={vp}
                className="border border-cream/15 p-10 md:p-12 group hover:border-lavender/50 transition-all duration-500 relative overflow-hidden"
                style={{ borderLeft: `3px solid ${box.accent}` }}
              >
                {/* Background shimmer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${box.accent}08, transparent 60%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="font-body text-[10px] tracking-[0.3em] uppercase font-semibold mb-1" style={{ color: box.accent }}>{box.subtitle}</p>
                      <h3 className="font-display text-3xl font-semibold text-cream">{box.name}</h3>
                    </div>
                    <WaxSeal size={44} color={box.accent} letter={box.name[0]} />
                  </div>

                  <div className="w-10 h-px mb-6" style={{ background: box.accent }} />
                  <p className="font-body text-sm font-medium text-cream/55 leading-relaxed mb-8">{box.desc}</p>

                  <ul className="space-y-2.5 mb-10">
                    {box.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 font-body text-xs font-medium text-cream/50">
                        <span className="w-3 h-px flex-shrink-0" style={{ background: box.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-6 border-t border-cream/10">
                    <span className="font-display text-xl text-cream/85">{box.price}</span>
                    <Link
                      to="/order"
                      className="font-body text-[11px] tracking-widest uppercase font-semibold text-cream/45 hover:text-lavender transition-colors group-hover:translate-x-1 inline-block transition-transform duration-300"
                    >
                      Order This Box →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ──────────────────────────────────────────────────── */}
      <section className="section-padding sepia-section relative overflow-hidden">
        <div className="absolute right-0 top-0 font-display text-[18rem] font-bold text-midnight/[0.018] pointer-events-none select-none leading-none" aria-hidden>+</div>

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={vp}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Extras</span>
              <div className="w-8 h-px bg-lavender" />
            </div>
            <h2 className="font-display text-5xl font-semibold text-midnight">Boosters & Add-ons</h2>
            <p className="font-body text-sm font-medium text-midnight/55 mt-5 max-w-lg mx-auto">
              Make your letter even more memorable with these curated extras.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {ADDONS.map((addon, i) => (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.12, duration: 0.65 }}
                viewport={vp}
                className="p-8 bg-cream letter-card group hover:shadow-md transition-all duration-300"
              >
                <p className="font-body text-[10px] tracking-[0.3em] uppercase font-semibold text-lavender mb-4">{addon.category}</p>
                <span className="text-2xl text-lavender block mb-4">{addon.icon}</span>
                <h4 className="font-display text-xl font-semibold text-midnight mb-3 group-hover:text-lavender transition-colors">{addon.name}</h4>
                <p className="font-body text-sm font-medium text-midnight/55 leading-relaxed mb-6">{addon.desc}</p>
                <p className="font-display text-xl text-midnight/70">{addon.price}</p>
              </motion.div>
            ))}
          </div>

          <InkDivider className="mt-16" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={vp}
            className="text-center mt-12"
          >
            <p className="font-body text-sm font-medium text-midnight/55 mb-8">
              Add-ons can be selected during the order process.
            </p>
            <Link to="/order" className="btn-primary">Start Your Order →</Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
