import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import ParticleBackground from '../components/three/ParticleBackground'
import FloatingEnvelope   from '../components/three/FloatingEnvelope'
import InkDivider         from '../components/ui/InkDivider'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } }

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 32, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  transition: { delay, duration: 1, ease: [0.22, 1, 0.36, 1] },
})

const COLLECTIONS = [
  { name: 'Lavender & Longing',  desc: 'For my love who is far away.',                          accent: '#800000' },
  { name: 'Midnight Letter',     desc: 'For an intimate, moody, and deep expression of love.',   accent: '#800000' },
  { name: 'Century of Love',     desc: 'For our Anniversary — celebrating the years.',           accent: '#E8A0B4' },
  { name: 'A Year of Heartfelt', desc: 'For a beautiful Birthday.',                              accent: '#FFC1D0' },
  { name: 'Grace & Lavender',    desc: 'Just thinking of you / Sympathy.',                      accent: '#800000' },
  { name: 'A Note of a Note',    desc: 'For my mentor, boss, or colleague.',                    accent: '#800000' },
  { name: 'Sunshine Script',     desc: 'For a friend who needs a smile today.',                 accent: '#F0D060' },
  { name: 'Velvet & Vanilla',    desc: 'My Valentine — Special Edition.',                       accent: '#E8A0B4' },
]

export default function Home() {
  const { scrollY } = useScroll()
  const heroY  = useTransform(scrollY, [0, 600], [0, -80])
  const heroOp = useTransform(scrollY, [0, 480], [1, 0])

  return (
    <motion.div {...fade}>

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ParticleBackground />

        {/* Layered vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-transparent to-cream z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/60 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Aged-paper horizontal lines */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(128,0,0,0.12) 40px)',
            backgroundSize: '100% 40px',
          }}
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center min-h-screen pt-28 pb-20">

          {/* â”€â”€ Hero copy â”€â”€ */}
          <motion.div style={{ y: heroY, opacity: heroOp }} className="flex flex-col">

            {/* Decorative stamp top-left */}
            <motion.div {...reveal(0.1)} className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Bespoke Letter Writing</span>
              <div className="w-8 h-px bg-lavender" />
            </motion.div>

            <motion.h1
              {...reveal(0.35)}
              className="font-display text-6xl md:text-7xl lg:text-[86px] font-semibold text-midnight leading-[0.9] mb-6 text-shadow-ink"
            >
              Helping you<br />
              <em style={{
                background: 'linear-gradient(135deg, #800000 0%, #D4A5A5 60%, #800000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontStyle: 'italic',
              }}>
                say what
              </em><br />
              matters most
            </motion.h1>

            <motion.div {...reveal(0.5)} className="flex items-center gap-4 mb-8">
              <div className="w-14 h-px bg-gradient-to-r from-lavender to-dusty-rose" />
              <div className="w-2 h-2 rotate-45 bg-lavender/50" />
            </motion.div>

            <motion.p {...reveal(0.6)} className="font-body text-base font-medium text-midnight/70 max-w-md leading-relaxed mb-10">
              Bespoke letters that become cinematic heirlooms. We find the words that
              live in your chest — and give them a permanent home on paper.
            </motion.p>

            <motion.div {...reveal(0.78)} className="flex flex-wrap gap-4">
              <Link to="/order"    className="btn-primary">Start Your Letter →</Link>
              <Link to="/packages" className="btn-outline">Explore Collections</Link>
            </motion.div>

            {/* Small italic caption */}
            <motion.p {...reveal(1)} className="font-display text-sm italic text-midnight/30 mt-8">
              "Words are the most durable things we leave behind."
            </motion.p>
          </motion.div>

          {/* â”€â”€ 3D Envelope â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            transition={{ delay: 0.55, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block relative"
            style={{ height: '480px' }}
          >
            {/* Decorative ring behind envelope */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-72 h-72 rounded-full border border-dashed border-lavender/20 animate-[spin_30s_linear_infinite]"
              />
              <div
                className="absolute w-56 h-56 rounded-full border border-lavender/10 animate-[spin_20s_linear_infinite_reverse]"
              />
            </div>
            <FloatingEnvelope />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="font-body text-[10px] tracking-[0.35em] uppercase font-semibold text-midnight/35">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-lavender/70 to-transparent"
          />
        </motion.div>
      </section>

      {/* â”€â”€ PHILOSOPHY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section-padding sepia-section relative z-10 overflow-hidden">
        {/* Large decorative script in background */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display text-[18rem] font-semibold text-midnight/[0.025] select-none leading-none"
            style={{ transform: 'rotate(-8deg)' }}
          >
            Nicys
          </span>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Our Philosophy</span>
              <div className="w-8 h-px bg-lavender" />
            </div>

            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-midnight leading-[0.95] mb-6 text-shadow-ink">
              Words are the<br />most lasting <em className="italic">gift.</em>
            </h2>

            <InkDivider />

            <p className="font-body text-base font-medium text-midnight/65 max-w-2xl mx-auto leading-relaxed mb-12">
              In a world of quick texts and forgotten voicemails, we believe some things
              deserve to be written down — slowly, beautifully, with full intention.
              A Nicys letter is not merely correspondence. It is an heirloom.
            </p>

            <Link to="/services" className="btn-outline">Discover How We Work</Link>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ SERVICES PREVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section-padding bg-midnight relative z-10 overflow-hidden">
        {/* Background texture lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(128,0,0,0.5) 40px)',
            backgroundSize: '100% 40px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #800000, transparent)' }} />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D4A5A5, transparent)' }} />

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-lavender/50" />
              <span className="section-label text-lavender">How We Serve You</span>
              <div className="w-8 h-px bg-lavender/50" />
            </div>
            <h2 className="font-display text-5xl md:text-6xl font-semibold text-cream leading-tight text-shadow-ink">
              Two Tiers, One Promise
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '✦', tier: "Scribe's Tier", tagline: 'I craft the narrative for you.',
                desc: "You share your memories, the feelings you can't quite name, the story behind the person. We find the words — beautifully, precisely, with warmth that lands.",
                from: 'From ₦15,000',
              },
              {
                icon: '◈', tier: "Designer's Tier", tagline: 'You bring the words; we make them beautiful.',
                desc: "You've written it. Now we give your words the visual life they deserve — elegant layout, handwritten styling, premium presentation that commands attention.",
                from: 'From ₦8,000',
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                viewport={{ once: false, amount: 0.3 }}
                className="group p-10 border border-cream/10 hover:border-lavender/50 transition-all duration-500 letter-card relative"
                style={{ '--tw-shadow': '0 0 40px rgba(128,0,0,0.05)' }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="text-2xl text-lavender block mb-7">{s.icon}</span>
                <h3 className="font-display text-3xl font-semibold text-cream mb-2">{s.tier}</h3>
                <p className="font-body text-sm font-medium text-lavender italic mb-5">{s.tagline}</p>
                <p className="font-body text-sm font-medium text-cream/55 leading-relaxed mb-10">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-lavender/90">{s.from}</span>
                  <Link
                    to="/order"
                    className="font-body text-[11px] tracking-widest uppercase font-semibold text-cream/45 hover:text-lavender transition-all duration-300 group-hover:translate-x-1.5 inline-block"
                  >
                    Choose This →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ COLLECTIONS GRID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="section-padding relative z-10 bg-cream overflow-hidden">
        {/* Decorative large 'N' watermark */}
        <div className="absolute top-12 right-0 font-display text-[20rem] font-bold text-midnight/[0.018] pointer-events-none select-none leading-none" aria-hidden>
          N
        </div>

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-8 h-px bg-lavender" />
              <span className="section-label text-lavender">Our Collections</span>
              <div className="w-8 h-px bg-lavender" />
            </div>
            <h2 className="section-heading">Letters for every chapter.</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-14">
            {COLLECTIONS.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
                viewport={{ once: false, amount: 0.2 }}
                className="group p-5 bg-cream-dark hover:bg-white transition-all duration-300 hover:shadow-md letter-card relative overflow-hidden"
                style={{ borderLeft: `3px solid ${c.accent}` }}
              >
                {/* Hover shimmer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${c.accent}08 0%, transparent 60%)`,
                  }}
                />
                <h4 className="font-display text-sm font-semibold text-midnight mb-1 group-hover:text-lavender transition-colors relative z-10">
                  {c.name}
                </h4>
                <p className="font-body text-[11px] font-medium text-midnight/45 relative z-10">{c.desc}</p>
              </motion.div>
            ))}
          </div>

          <InkDivider className="mb-12" />

          <div className="text-center">
            <Link to="/packages" className="btn-primary">View All Collections →</Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ TESTIMONIAL / QUOTE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-24 px-6 bg-midnight relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, rgba(128,0,0,0.5) 40px)',
            backgroundSize: '100% 40px',
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: false, amount: 0.4 }}
          >

            <p className="font-display text-2xl md:text-3xl font-light text-cream/80 italic leading-relaxed mb-8">
              "She read it three times. Each time, something new caught her breath.
              That's what a Nicys letter does — it doesn't just say the thing.
              It holds it."
            </p>
            <div className="w-10 h-px bg-lavender/50 mx-auto mb-4" />
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-lavender/70">
              A Client, Lagos — 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ CTA BANNER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="py-28 px-6 relative z-10 overflow-hidden sepia-section">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 40% 50%, #800000 0%, transparent 70%)' }}
        />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-midnight leading-[0.92] mb-8 text-shadow-ink">
              Ready to say<br />
              <em className="italic">what matters?</em>
            </h2>
            <InkDivider className="mb-8" />
            <p className="font-body text-base font-medium text-midnight/60 mb-12 max-w-lg mx-auto">
              Let's craft something beautiful together.<br />Every letter is a beginning.
            </p>
            <Link to="/order" className="btn-primary">Begin Your Letter →</Link>
          </motion.div>
        </div>
      </section>

    </motion.div>
  )
}
