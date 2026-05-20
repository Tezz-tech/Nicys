import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../../context/AdminContext'

const STATUS_OPTIONS = ['Received', 'In Progress', 'Complete', 'Delivered']

const STATUS_STYLES = {
  'Received':    'bg-amber-500/15 text-amber-300 border-amber-400/30',
  'In Progress': 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  'Complete':    'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  'Delivered':   'bg-[#800000]/15 text-[#800000] border-[#800000]/30',
}

function Row({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex gap-4 py-3 border-b border-[#800000]/8 last:border-0">
      <span className="font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/35 w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-body text-sm text-[#FFF8F0]/80 break-words min-w-0">{value}</span>
    </div>
  )
}

export default function OrderDetail({ order, onClose, onStatusUpdated }) {
  const { api }   = useAdmin()
  const [newStatus, setNewStatus] = useState(order.status)
  const [note, setNote]           = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const handleUpdate = async () => {
    if (newStatus === order.status && !note.trim()) return
    setSaving(true)
    setError('')
    try {
      const { data } = await api().patch(`/api/admin/orders/${order.orderId}/status`, {
        status: newStatus,
        note,
      })
      onStatusUpdated(data)
      setNote('')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
  const fmtFull = (iso) => iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-[580px] bg-[#1B2A4A] border-l border-[#800000]/15 z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#800000]/12 shrink-0">
          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-1">Order</p>
            <h2 className="font-display text-2xl font-semibold text-[#FFF8F0]">{order.orderId}</h2>
            <p className="font-body text-xs text-[#FFF8F0]/40 mt-1">{fmtFull(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-body text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF8F0]/5 hover:bg-[#FFF8F0]/10 text-[#FFF8F0]/50 hover:text-[#FFF8F0] transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* Customer + Recipient */}
          <section>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Customer</h3>
            <div className="bg-[#0d1627]/50 rounded-sm p-4">
              <Row label="Name"    value={order.senderName} />
              <Row label="Email"   value={order.senderEmail} />
              <Row label="Phone"   value={order.senderPhone} />
            </div>
          </section>

          <section>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Recipient</h3>
            <div className="bg-[#0d1627]/50 rounded-sm p-4">
              <Row label="Name"     value={order.recipientName} />
              <Row label="Email"    value={order.recipientEmail} />
              <Row label="Occasion" value={order.occasion} />
              <Row label="Address"  value={order.deliveryAddress} />
            </div>
          </section>

          {/* Order Details */}
          <section>
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Order Details</h3>
            <div className="bg-[#0d1627]/50 rounded-sm p-4">
              <Row label="Collection"  value={order.letterCollection} />
              <Row label="Tier"        value={order.tier === 'scribe' ? "Scribe's Tier" : "Designer's Tier"} />
              <Row label="Format"      value={order.format} />
              <Row label="Signature"   value={order.signature} />
              <Row label="Delivery"    value={fmt(order.deliveryDate)} />
            </div>
          </section>

          {/* Designer message */}
          {order.tier === 'designer' && order.designerMessage && (
            <section>
              <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Designer's Message</h3>
              <div className="bg-[#0d1627]/50 rounded-sm p-4">
                <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.designerMessage}</p>
              </div>
            </section>
          )}

          {/* Scribe prompts */}
          {order.tier === 'scribe' && (
            <section>
              <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Scribe Prompts</h3>
              <div className="bg-[#0d1627]/50 rounded-sm p-4 space-y-4">
                {order.littleThings && (
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-[#800000]/50 mb-1">The Little Things</p>
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.littleThings}</p>
                  </div>
                )}
                {order.coreMemory && (
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-[#800000]/50 mb-1">The Core Memory</p>
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.coreMemory}</p>
                  </div>
                )}
                {order.unspoken && (
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-[#800000]/50 mb-1">The Unspoken</p>
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.unspoken}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Uploaded Letter Images */}
          {order.letterImages?.length > 0 && (
            <section>
              <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">
                Uploaded Files ({order.letterImages.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {order.letterImages.map((url, i) => {
                  const isPdf = url.toLowerCase().includes('.pdf') || url.includes('/raw/')
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-sm overflow-hidden border border-[#800000]/20 hover:border-[#800000]/50 transition-colors group"
                    >
                      {isPdf ? (
                        <div className="flex flex-col items-center justify-center bg-[#0d1627] py-8 px-4 text-center">
                          <span className="text-3xl text-[#800000]/50 mb-2">▣</span>
                          <p className="font-body text-xs text-[#800000]/50 group-hover:text-[#800000] transition-colors">
                            Document {i + 1} — Click to open
                          </p>
                        </div>
                      ) : (
                        <div>
                          <img
                            src={url}
                            alt={`Upload ${i + 1}`}
                            className="w-full h-32 object-cover bg-[#0d1627]"
                          />
                          <p className="font-body text-xs text-[#800000]/50 text-center py-1.5 bg-[#0d1627]/70 group-hover:text-[#800000] transition-colors">
                            Image {i + 1}
                          </p>
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <section>
              <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Status History</h3>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-4 bg-[#0d1627]/50 rounded-sm px-4 py-3">
                    <span className={`font-body text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 self-start mt-0.5 ${STATUS_STYLES[entry.status]}`}>
                      {entry.status}
                    </span>
                    <div className="min-w-0">
                      {entry.note && <p className="font-body text-sm text-[#FFF8F0]/70">{entry.note}</p>}
                      <p className="font-body text-xs text-[#FFF8F0]/30 mt-0.5">{fmtFull(entry.changedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Update Status */}
          <section className="border-t border-[#800000]/12 pt-6">
            <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-4">Update Status</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => setNewStatus(s)}
                    className={`font-body text-xs font-semibold tracking-wider uppercase py-2.5 px-3 rounded-sm border transition-all ${
                      newStatus === s
                        ? STATUS_STYLES[s] + ' scale-[0.98]'
                        : 'border-[#FFF8F0]/10 text-[#FFF8F0]/30 hover:border-[#FFF8F0]/20 hover:text-[#FFF8F0]/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note for this update (optional)…"
                rows={3}
                className="w-full bg-[#0d1627] border border-[#800000]/20 rounded-sm px-4 py-3 font-body text-sm text-[#FFF8F0]/80 placeholder-[#FFF8F0]/20 focus:outline-none focus:border-[#800000]/50 transition-colors resize-none"
              />

              {error && <p className="font-body text-xs text-[#D4A5A5]">{error}</p>}

              <button
                onClick={handleUpdate}
                disabled={saving || (newStatus === order.status && !note.trim())}
                className="w-full bg-[#800000] hover:bg-[#b990c7] disabled:opacity-40 text-[#1B2A4A] font-body font-semibold text-sm tracking-widest uppercase py-3 rounded-sm transition-colors"
              >
                {saving ? 'Saving…' : 'Save Update'}
              </button>
            </div>
          </section>

          {/* Bottom spacer */}
          <div className="h-6" />
        </div>
      </motion.aside>

    </>
  )
}
