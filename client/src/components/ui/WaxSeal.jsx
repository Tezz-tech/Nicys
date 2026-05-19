import { motion } from 'framer-motion'

/* Decorative wax seal SVG — used as section ornament */
export default function WaxSeal({ size = 72, color = '#2D6A4F', letter = 'N', className = '' }) {
  return (
    <motion.div
      initial={{ scale: 1.4, opacity: 0, rotate: -12 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      viewport={{ once: false, amount: 0.5 }}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 80 80"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Scalloped outer edge */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2
          const r = 36
          const cx = 40 + r * Math.cos(angle)
          const cy = 40 + r * Math.sin(angle)
          return (
            <circle key={i} cx={cx} cy={cy} r="5" fill={color} opacity="0.85" />
          )
        })}
        {/* Main seal body */}
        <circle cx="40" cy="40" r="28" fill={color} />
        {/* Inner ring */}
        <circle cx="40" cy="40" r="24" fill="none" stroke="rgba(255,248,240,0.25)" strokeWidth="0.8" />
        {/* Letter */}
        <text
          x="40"
          y="46"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="22"
          fontWeight="600"
          fill="rgba(255,248,240,0.9)"
          letterSpacing="1"
        >
          {letter}
        </text>
      </svg>
    </motion.div>
  )
}
