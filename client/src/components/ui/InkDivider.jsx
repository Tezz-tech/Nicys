import { motion } from 'framer-motion'

/* Calligraphic flourish divider — inject between sections */
export default function InkDivider({ light = false, className = '' }) {
  const stroke = light ? 'rgba(255,248,240,0.25)' : 'rgba(200,164,212,0.5)'
  const fill   = light ? 'rgba(255,248,240,0.4)'  : '#C8A4D4'

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: false, amount: 0.5 }}
      className={`flex items-center justify-center py-2 ${className}`}
    >
      <svg
        viewBox="0 0 340 28"
        className="w-full max-w-xs md:max-w-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left wave */}
        <path
          d="M0 14 Q35 5 70 14 Q105 23 140 14"
          stroke={stroke}
          strokeWidth="0.8"
        />
        {/* Left small circle */}
        <circle cx="130" cy="14" r="2" fill={fill} opacity="0.7" />

        {/* Central diamond */}
        <path
          d="M155 14 L170 4 L185 14 L170 24 Z"
          fill={fill}
          opacity="0.55"
        />
        {/* Inner diamond */}
        <path
          d="M161 14 L170 8 L179 14 L170 20 Z"
          fill={fill}
          opacity="0.85"
        />

        {/* Right small circle */}
        <circle cx="210" cy="14" r="2" fill={fill} opacity="0.7" />
        {/* Right wave */}
        <path
          d="M200 14 Q235 5 270 14 Q305 23 340 14"
          stroke={stroke}
          strokeWidth="0.8"
        />

        {/* Tiny dots flanking */}
        <circle cx="148" cy="14" r="1.2" fill={fill} opacity="0.5" />
        <circle cx="192" cy="14" r="1.2" fill={fill} opacity="0.5" />
      </svg>
    </motion.div>
  )
}
