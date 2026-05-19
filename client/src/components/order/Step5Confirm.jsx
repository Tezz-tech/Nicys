import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useOrder } from '../../context/OrderContext'
import { COLLECTIONS, GIFT_BOXES, ADDONS } from '../../data/collections'

function getCollectionName(id) {
  return (
    COLLECTIONS.find(c => c.id === id)?.name ||
    GIFT_BOXES.find(b => b.id === id)?.name ||
    id
  )
}

function getAddonNames(ids) {
  return ids.map(id => ADDONS.find(a => a.id === id)?.name || id)
}

export default function Step5Confirm() {
  const { orderData, orderId, resetOrder } = useOrder()

  const rows = [
    { label: 'Order Reference',    value: orderId || '—' },
    { label: 'Service Type',       value: orderData.serviceType === 'physical' ? 'Physical Gift Box' : 'Digital Letter' },
    { label: 'Collection',         value: getCollectionName(orderData.collection) },
    { label: 'Recipient',          value: orderData.recipientName },
    { label: 'Occasion',           value: orderData.occasion },
    { label: 'Service Tier',       value: orderData.tier === 'scribe' ? "Scribe's Tier" : "Designer's Tier" },
    { label: 'Desired Delivery',   value: orderData.deliveryDate ? new Date(orderData.deliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
    ...(orderData.addons.length ? [{ label: 'Add-ons', value: getAddonNames(orderData.addons).join(', ') }] : []),
    { label: 'Your Name',          value: orderData.senderName },
    { label: 'Your Email',         value: orderData.senderEmail },
    ...(orderData.serviceType === 'physical' ? [{ label: 'Delivery Address', value: orderData.deliveryAddress }] : [{ label: "Recipient's Email", value: orderData.recipientEmail }]),
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Success header */}
      <div className="text-center mb-14">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-lavender/15 border border-lavender/30 flex items-center justify-center mx-auto mb-7"
        >
          <span className="font-display text-3xl text-lavender">✦</span>
        </motion.div>

        <h2 className="font-display text-5xl font-light text-midnight mb-3">
          Your order is placed.
        </h2>
        <p className="font-body text-sm text-midnight/60 max-w-md mx-auto leading-relaxed">
          We've received your order and will begin working on your letter.
          You'll receive a confirmation email shortly.
        </p>

        {orderId && (
          <div className="inline-block mt-6 px-8 py-4 bg-cream-dark border border-lavender/25">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-midnight/40 mb-1">Your Reference Number</p>
            <p className="font-display text-2xl text-midnight tracking-widest">{orderId}</p>
            <p className="font-body text-xs text-midnight/40 mt-1">Save this to track your order</p>
          </div>
        )}
      </div>

      {/* Order summary */}
      <div className="border border-midnight/10 p-8 mb-10">
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

      {/* What's next */}
      <div className="p-6 bg-lavender/8 border border-lavender/20 mb-10">
        <h4 className="font-display text-lg text-midnight mb-4">What happens next?</h4>
        <ul className="space-y-2.5">
          {[
            'We\'ll verify your payment and send a confirmation email.',
            'Our writer will begin crafting your letter within 24 hours.',
            'You\'ll receive a draft for review (Scribe\'s Tier) or your styled letter (Designer\'s Tier).',
            'Your letter will be delivered by your requested date.',
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
        <button
          onClick={resetOrder}
          className="btn-ghost"
        >
          Place Another Order
        </button>
      </div>

      <p className="font-body text-xs text-midnight/35 text-center mt-8">
        Questions? Reach us on{' '}
        <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="text-emerald hover:underline">
          WhatsApp
        </a>{' '}
        or{' '}
        <a href="mailto:hello@nicys.ng" className="text-lavender hover:underline">hello@nicys.ng</a>
      </p>
    </motion.div>
  )
}
