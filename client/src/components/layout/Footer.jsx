import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import InkDivider from '../ui/InkDivider'
import WaxSeal    from '../ui/WaxSeal'

const LINKS = [
  { path: '/',         label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/packages', label: 'Collections' },
  { path: '/order',    label: 'Order Now' },
  { path: '/track',    label: 'Track Order' },
  { path: '/contact',  label: 'Contact' },
]

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x:   0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Footer() {
  const ref = useRef(null)
  /* once:false means it re-animates every time the footer enters view —
     since App.jsx re-mounts Footer on each navigation, this fires fresh on every page */
  const inView = useInView(ref, { once: false, amount: 0.15 })

  return (
    <footer ref={ref} className="bg-midnight text-cream/80 relative overflow-hidden">

      {/* Ink flourish top border */}
      <div className="pt-8 pb-0">
        <InkDivider light className="px-16" />
      </div>

      {/* Decorative ruled lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(200,164,212,0.3) 32px)',
          backgroundSize: '100% 32px',
        }}
      />

      {/* Wax seal top-center ornament */}
      <motion.div
        className="flex justify-center -mt-2 mb-6"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <WaxSeal size={52} color="#2D6A4F" letter="N" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-14 pb-16 border-b border-cream/10"
        >
          {/* Brand */}
          <motion.div variants={slideLeft}>
            <img
              src="/logo.png"
              alt="Nicys"
              className="h-28 w-auto object-contain mb-4"
              style={{ maxWidth: '280px', filter: 'brightness(0) invert(1)' }}
            />
            <p className="font-body text-xs text-lavender tracking-widest italic mb-6 font-medium">
              Helping you say what matters most
            </p>
            <p className="font-body text-xs text-cream/50 leading-relaxed max-w-xs mb-8">
              Bespoke letters that become cinematic heirlooms. We craft words
              that endure — beautifully, intentionally, with heart.
            </p>

            {/* Decorative postmark stamp */}
            <div className="inline-flex">
              <div className="stamp w-20 h-20 flex-col gap-0.5 text-center border-lavender/35">
                <p className="font-body text-[7px] tracking-[0.2em] uppercase text-lavender/60 leading-tight">Abuja</p>
                <p className="font-display text-xs text-lavender/80 italic">Nicys</p>
                <p className="font-body text-[7px] tracking-[0.15em] text-lavender/50">{new Date().getFullYear()}</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                { href: 'https://instagram.com/nicys.ng', label: 'IG' },
                { href: 'https://wa.me/2348000000000',    label: 'WA' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center font-body text-[10px] font-semibold text-cream/50 hover:border-lavender hover:text-lavender transition-all duration-300"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={item}>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase font-semibold text-lavender mb-7">Navigate</h4>
            <nav className="flex flex-col gap-4">
              {LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="ink-link font-body text-xs font-medium tracking-wide text-cream/55 hover:text-lavender transition-colors duration-200 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item}>
            <h4 className="font-body text-[10px] tracking-[0.4em] uppercase font-semibold text-lavender mb-7">Connect</h4>
            <div className="flex flex-col gap-4">
              {[
                { href: 'https://wa.me/2348000000000', label: 'WhatsApp', sub: 'Primary channel' },
                { href: 'https://instagram.com/nicys.ng', label: '@nicys.ng', sub: 'Instagram' },
                { href: 'mailto:nicysletters@gmail.com', label: 'nicysletters@gmail.com', sub: 'Email' },
              ].map(({ href, label, sub }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="group flex items-start gap-3"
                >
                  <span className="w-3 h-px bg-cream/20 group-hover:bg-lavender transition-colors mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-body text-xs font-medium text-cream/65 group-hover:text-lavender transition-colors">{label}</p>
                    <p className="font-body text-[10px] text-cream/35">{sub}</p>
                  </div>
                </a>
              ))}

              <div className="mt-4 pt-4 border-t border-cream/10">
                <p className="font-body text-xs font-semibold text-cream/50 leading-relaxed">
                  Available daily<br />7:00 AM – 11:00 PM
                </p>
                <p className="font-body text-xs text-cream/30 mt-2">
                  Physical delivery: Abuja only
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center"
        >
          <p className="font-body text-[11px] font-medium text-cream/35 max-w-sm">
            No refunds due to the deeply personalised nature of our work.
          </p>
          <div className="flex gap-6">
            {['Terms & Conditions', 'Privacy Policy'].map(t => (
              <span key={t} className="font-body text-[11px] font-medium text-cream/30 hover:text-cream/55 cursor-pointer transition-colors">
                {t}
              </span>
            ))}
          </div>
          <p className="font-body text-[11px] text-cream/25">
            © {new Date().getFullYear()} Nicys
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
