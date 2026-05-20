import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { path: '/',         label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/packages', label: 'Collections' },
  { path: '/order',    label: 'Order' },
  { path: '/track',    label: 'Track' },
  { path: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-card shadow-sm py-4' : 'bg-transparent py-7'
      }`}
    >
      {/* Thin top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="group flex items-center">
          <img
            src="/logo.png"
            alt="Nicys"
            className="h-24 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            style={{ maxWidth: '260px' }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {NAV.map(({ path, label }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`relative font-body text-[11px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 group ${
                  active ? 'text-lavender' : 'text-midnight hover:text-lavender'
                }`}
              >
                {label}
                <span className={`absolute -bottom-0.5 left-0 h-px transition-all duration-400 ${
                  active
                    ? 'w-full bg-gradient-to-r from-lavender to-dusty-rose'
                    : 'w-0 group-hover:w-full bg-lavender'
                }`} />
              </Link>
            )
          })}
          <Link
            to="/order"
            className="ml-4 px-6 py-3 bg-midnight text-cream font-body text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-300 hover:bg-lavender hover:text-midnight relative group overflow-hidden"
          >
            <span className="relative z-10">Begin Your Letter</span>
            {/* Ink sweep on hover */}
            <span className="absolute inset-0 bg-lavender translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-400 ease-out" />
            <span className="relative z-10 group-hover:text-midnight transition-colors duration-300">
            </span>
          </Link>
        </nav>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 z-10"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-full h-px bg-midnight block transition-all duration-300"
              style={{
                transform: open
                  ? i === 0 ? 'rotate(45deg) translateY(6px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translateY(-6px)'
                  : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden glass-card mx-4 mt-3 rounded letter-card"
          >
            <div className="flex flex-col py-8 px-8 gap-6">
              {NAV.map(({ path, label }, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={path}
                    className="ink-link font-body text-[11px] tracking-[0.2em] uppercase font-semibold text-midnight hover:text-lavender transition-colors w-fit"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <Link to="/order" className="btn-primary text-center py-3 mt-2 text-xs">
                Begin Your Letter
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Thin bottom decorative border (only when scrolled) */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender/20 to-transparent" />
      )}
    </motion.header>
  )
}
