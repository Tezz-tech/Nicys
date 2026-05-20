import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'

const COLLECTION_NAMES = {
  'lavender-longing':  'Lavender and Longing',
  'midnight-letter':   'Midnight Letter',
  'century-of-love':   'Century of Love',
  'year-of-heartfelt': 'A Year of Heartfelt',
  'grace-lavender':    'Grace and Lavender',
  'note-of-a-note':    'A Note of a Note',
  'sunshine-script':   'Sunshine Script',
  'velvet-vanilla':    'Velvet and Vanilla',
}

const FORMAT_NAMES = {
  'pocket-hug':         'Pocket Hug (PDF)',
  'heartfelt-heirloom': 'Heartfelt Heirloom (PDF)',
  'cinematic-scribe':   'Cinematic Scribe (Video Letter)',
}

export default function Step5Confirm() {
  const { orderData, orderId, resetOrder } = useOrder()

  const rows = [
    { label: 'Collection',       value: COLLECTION_NAMES[orderData.collection] || orderData.collection },
    { label: 'Recipient',        value: orderData.recipientName },
    { label: 'Tier',             value: orderData.tier === 'designer' ? "Designer's Tier" : "Scribe's Tier" },
    { label: 'Format',           value: FORMAT_NAMES[orderData.format] || orderData.format },
    { label: 'Signature',        value: orderData.signature },
    { label: 'Delivery By',      value: orderData.deliveryDate ? new Date(orderData.deliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
    { label: 'Your Name',        value: orderData.senderName },
    { label: 'Your Email',       value: orderData.senderEmail },
    { label: "Recipient's Email", value: orderData.recipientEmail },
    ...(orderData.letterImages?.length ? [{ label: 'Files Uploaded', value: `${orderData.letterImages.length} file${orderData.letterImages.length !== 1 ? 's' : ''}` }] : []),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Success icon */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-lavender/15 border border-lavender/35 flex items-center justify-center mx-auto mb-7"
          style={{ boxShadow: '0 8px 24px rgba(196,168,240,0.20), inset 0 1px 0 rgba(255,255,255,0.6)' }}
        >
          <span className="font-display text-3xl text-lavender">✦</span>
        </motion.div>

        <h2 className="font-display text-5xl font-light text-midnight mb-3">
          Your letter is on its way.
        </h2>
        <p className="font-body text-sm text-midnight/60 max-w-md mx-auto leading-relaxed">
          We've received your order. Remember to send your payment screenshot to us on IG — once confirmed, your letter journey begins.
        </p>

        {orderId && (
          <div
            className="inline-block mt-6 px-8 py-4 bg-cream-dark border border-lavender/25 rounded-sm"
            style={{ boxShadow: '0 4px 16px rgba(13,27,56,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-midnight/40 mb-1">Your Reference Number</p>
            <p className="font-display text-2xl text-midnight tracking-widest">{orderId}</p>
            <p className="font-body text-xs text-midnight/40 mt-1">Save this to track your order</p>
          </div>
        )}
      </div>

      {/* Order summary */}
      <div
        className="border border-midnight/10 p-8 mb-8 rounded-sm"
        style={{ boxShadow: '0 3px 14px rgba(13,27,56,0.05), inset 0 1px 0 rgba(255,255,255,0.7)' }}
      >
        <h3 className="font-display text-2xl text-midnight mb-7 pb-4 border-b border-midnight/8">Order Summary</h3>
        <div className="space-y-4">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start border-b border-midnight/5 pb-4 last:border-0 last:pb-0">
              <span className="font-body text-[10px] tracking-widest uppercase text-midnight/40 flex-shrink-0 mr-4">{label}</span>
              <span className="font-body text-sm text-midnight text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment reminder */}
      <div
        className="p-6 bg-lavender/8 border border-lavender/22 mb-8 rounded-sm"
        style={{ boxShadow: 'inset 0 1px 0 rgba(196,168,240,0.15)' }}
      >
        <h4 className="font-display text-lg text-midnight mb-3">Don't forget your payment</h4>
        <p className="font-body text-sm text-midnight/65 leading-relaxed">
          Transfer to <strong>Moniepoint — Eunice Adams-Idakwo (Nicys)</strong>, account <strong>6716866025</strong>.
          Then send your receipt screenshot to us on IG with the recipient's email in the same message.
        </p>
      </div>

      {/* What's next */}
      <div className="p-6 bg-cream-dark border border-midnight/8 mb-10 rounded-sm">
        <h4 className="font-display text-lg text-midnight mb-4">What happens next?</h4>
        <ul className="space-y-2.5">
          {[
            'We\'ll verify your payment and send a confirmation.',
            'Our writer will begin crafting your letter within 24 hours.',
            'Your letter will be delivered to the recipient\'s inbox by your requested date.',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 font-body text-sm text-midnight/65">
              <span className="text-lavender mt-0.5 text-xs flex-shrink-0">◆</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/track" className="btn-outline">Track My Order</Link>
        <Link to="/" onClick={resetOrder} className="btn-ghost">Return Home</Link>
        <button onClick={resetOrder} className="btn-ghost">Place Another Order</button>
      </div>

      <p className="font-body text-xs text-midnight/35 text-center mt-8">
        Questions? Reach us on Instagram or email{' '}
        <a href="mailto:nicysletters@gmail.com" className="text-lavender hover:underline">nicysletters@gmail.com</a>
      </p>
    </motion.div>
  )
}
