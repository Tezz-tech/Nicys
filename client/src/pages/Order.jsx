import { motion } from 'framer-motion'
import { useOrder } from '../context/OrderContext'
import Step1Service    from '../components/order/Step1Service'
import Step2Collection from '../components/order/Step2Collection'
import Step3Details    from '../components/order/Step3Details'
import Step4Contact    from '../components/order/Step4Contact'
import Step5Confirm    from '../components/order/Step5Confirm'

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 } }

const STEP_LABELS = ['Occasion', 'Your Voice', 'The Letter', 'Final Details', 'Confirmation']

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center mb-16">
      {STEP_LABELS.map((label, i) => {
        const num    = i + 1
        const done   = num < step
        const active = num === step
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={active ? { scale: 1.1 } : { scale: 1 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all duration-400 relative ${
                  active ? 'bg-lavender text-midnight shadow-md shadow-lavender/20'
                  : done  ? 'bg-emerald text-cream'
                  : 'bg-cream border-2 border-midnight/18 text-midnight/30'
                }`}
              >
                {done ? '✓' : num}
                {active && <span className="absolute inset-0 rounded-full border-2 border-lavender animate-ping opacity-20" />}
              </motion.div>
              <p className={`font-body text-[9px] tracking-wide uppercase font-semibold mt-2 hidden md:block ${
                active ? 'text-lavender' : done ? 'text-emerald' : 'text-midnight/25'
              }`}>
                {label}
              </p>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-8 md:w-14 h-px mx-1 mb-4 transition-colors duration-400 ${done ? 'bg-lavender' : 'bg-midnight/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Order() {
  const { step } = useOrder()

  const STEPS = {
    1: <Step1Service />,
    2: <Step2Collection />,
    3: <Step3Details />,
    4: <Step4Contact />,
    5: <Step5Confirm />,
  }

  return (
    <motion.div {...fade}>

      {/* ── Header ── */}
      <section className="pt-36 pb-0 px-6 md:px-16 sepia-section relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C8A4D4, transparent)' }}
        />
        {/* Large watermark */}
        <div className="absolute right-0 bottom-0 font-display text-[18rem] font-bold text-midnight/[0.02] pointer-events-none select-none leading-none" aria-hidden>O</div>

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-px bg-lavender" />
            <span className="section-label text-lavender">Order a Letter</span>
          </motion.div>

          <div className="flex items-end justify-between mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="font-display text-5xl md:text-6xl font-semibold text-midnight leading-[0.92] text-shadow-ink"
            >
              Begin your<br /><em className="italic text-lavender">heirloom letter.</em>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="px-6 md:px-16 py-16 bg-cream">
        <div className="max-w-3xl mx-auto">
          <StepIndicator step={step} />

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, x: 0,  filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45 }}
            className="letter-card p-8 md:p-10 bg-cream ruled-bg"
          >
            {STEPS[step]}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
