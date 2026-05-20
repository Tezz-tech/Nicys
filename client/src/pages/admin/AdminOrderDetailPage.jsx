import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
      <span className="font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/35 w-40 shrink-0 pt-0.5">{label}</span>
      <span className="font-body text-sm text-[#FFF8F0]/80 break-words min-w-0">{value}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="bg-[#1a0a0a] border border-[#800000]/12 rounded-sm p-6">
      <h2 className="font-body text-xs font-semibold tracking-widest uppercase text-[#800000]/60 mb-5">{title}</h2>
      {children}
    </section>
  )
}

export default function AdminOrderDetailPage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { api }    = useAdmin()

  const [order, setOrder]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [note, setNote]           = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    setLoading(true)
    api().get(`/api/admin/orders/${id}`)
      .then(({ data }) => { setOrder(data); setNewStatus(data.status) })
      .catch(() => navigate('/admin/orders', { replace: true }))
      .finally(() => setLoading(false))
  }, [api, id, navigate])

  const handleUpdate = async () => {
    if (newStatus === order.status && !note.trim()) return
    setSaving(true)
    setError('')
    try {
      const { data } = await api().patch(`/api/admin/orders/${order.orderId}/status`, { status: newStatus, note })
      setOrder(data)
      setNote('')
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const fmt     = (iso) => iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
  const fmtFull = (iso) => iso ? new Date(iso).toLocaleString('en-GB',  { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <p className="font-body text-sm text-[#FFF8F0]/30">Loading order…</p>
    </div>
  )

  if (!order) return null

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/admin/orders"
            className="font-body text-xs text-[#FFF8F0]/35 hover:text-[#FFF8F0]/60 tracking-widest uppercase transition-colors mb-3 inline-block"
          >
            ← All Orders
          </Link>
          <h1 className="font-display text-3xl font-semibold text-[#FFF8F0]">{order.orderId}</h1>
          <p className="font-body text-xs text-[#FFF8F0]/35 mt-1">{fmtFull(order.createdAt)}</p>
        </div>
        <span className={`font-body text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full border mt-8 ${STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left column — order content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer */}
          <Section title="Customer">
            <div className="bg-[#0d0000]/50 rounded-sm p-4">
              <Row label="Name"  value={order.senderName} />
              <Row label="Email" value={order.senderEmail} />
              <Row label="Phone" value={order.senderPhone} />
            </div>
          </Section>

          {/* Recipient */}
          <Section title="Recipient">
            <div className="bg-[#0d0000]/50 rounded-sm p-4">
              <Row label="Name"     value={order.recipientName} />
              <Row label="Email"    value={order.recipientEmail} />
              <Row label="Address"  value={order.deliveryAddress} />
            </div>
          </Section>

          {/* Order details */}
          <Section title="Order Details">
            <div className="bg-[#0d0000]/50 rounded-sm p-4">
              <Row label="Collection" value={order.letterCollection} />
              <Row label="Tier"       value={order.tier === 'scribe' ? "Scribe's Tier" : "Designer's Tier"} />
              <Row label="Format"     value={order.format} />
              <Row label="Signature"  value={order.signature} />
              <Row label="Delivery"   value={fmt(order.deliveryDate)} />
            </div>
          </Section>

          {/* Designer message */}
          {order.tier === 'designer' && order.designerMessage && (
            <Section title="Designer's Message">
              <div className="bg-[#0d0000]/50 rounded-sm p-4">
                <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.designerMessage}</p>
              </div>
            </Section>
          )}

          {/* Scribe prompts */}
          {order.tier === 'scribe' && (order.littleThings || order.coreMemory || order.unspoken) && (
            <Section title="Scribe Prompts">
              <div className="bg-[#0d0000]/50 rounded-sm p-4 space-y-5">
                {order.littleThings && (
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-[#800000]/50 mb-1.5">The Little Things</p>
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.littleThings}</p>
                  </div>
                )}
                {order.coreMemory && (
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-[#800000]/50 mb-1.5">The Core Memory</p>
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.coreMemory}</p>
                  </div>
                )}
                {order.unspoken && (
                  <div>
                    <p className="font-body text-[10px] tracking-widest uppercase text-[#800000]/50 mb-1.5">The Unspoken</p>
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{order.unspoken}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Uploaded files */}
          {order.letterImages?.length > 0 && (
            <Section title={`Uploaded Files (${order.letterImages.length})`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {order.letterImages.map((url, i) => {
                  const isPdf = /\.pdf|\/raw\//i.test(url)
                  return (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                      className="block rounded-sm overflow-hidden border border-[#800000]/20 hover:border-[#800000]/50 transition-colors group"
                    >
                      {isPdf ? (
                        <div className="flex flex-col items-center justify-center bg-[#0d0000] py-8 px-4 text-center">
                          <span className="text-3xl text-[#800000]/40 mb-2">▣</span>
                          <p className="font-body text-xs text-[#800000]/40 group-hover:text-[#800000] transition-colors">Doc {i + 1}</p>
                        </div>
                      ) : (
                        <div>
                          <img src={url} alt={`File ${i + 1}`} className="w-full h-28 object-cover bg-[#0d0000]" />
                          <p className="font-body text-xs text-[#800000]/40 text-center py-1.5 bg-[#0d0000]/70 group-hover:text-[#800000] transition-colors">
                            Image {i + 1}
                          </p>
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            </Section>
          )}

          {/* Payment proof */}
          {order.paymentProofUrl && (
            <Section title="Payment Proof">
              <a href={order.paymentProofUrl} target="_blank" rel="noreferrer"
                className="block rounded-sm overflow-hidden border border-[#800000]/20 hover:border-[#800000]/50 transition-colors group"
              >
                {/\.pdf/i.test(order.paymentProofUrl) ? (
                  <div className="flex items-center justify-center gap-3 bg-[#0d0000] py-8">
                    <span className="text-2xl text-[#800000]/50">▣</span>
                    <p className="font-body text-sm text-[#800000]/50 group-hover:text-[#800000] transition-colors">Open PDF Receipt</p>
                  </div>
                ) : (
                  <div>
                    <img src={order.paymentProofUrl} alt="Payment receipt" className="w-full max-h-64 object-contain bg-[#0d0000]" />
                    <p className="font-body text-xs text-[#800000]/40 text-center py-2 bg-[#0d0000]/70">Click to open full size</p>
                  </div>
                )}
              </a>
            </Section>
          )}
        </div>

        {/* Right column — status + history */}
        <div className="space-y-6">

          {/* Update status */}
          <Section title="Update Status">
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
                placeholder="Add a note (optional)…"
                rows={3}
                className="w-full bg-[#0d0000] border border-[#800000]/20 rounded-sm px-4 py-3 font-body text-sm text-[#FFF8F0]/80 placeholder-[#FFF8F0]/20 focus:outline-none focus:border-[#800000]/50 transition-colors resize-none"
              />
              {error && <p className="font-body text-xs text-[#E8A0B4]">{error}</p>}
              <button
                onClick={handleUpdate}
                disabled={saving || (newStatus === order.status && !note.trim())}
                className="w-full bg-[#800000] hover:bg-[#b490e8] disabled:opacity-40 disabled:pointer-events-none text-[#0D1B38] font-body font-semibold text-sm tracking-widest uppercase py-3 rounded-sm transition-colors"
              >
                {saving ? 'Saving…' : 'Save Update'}
              </button>
            </div>
          </Section>

          {/* Status history */}
          {order.statusHistory?.length > 0 && (
            <Section title="Status History">
              <div className="space-y-2">
                {[...order.statusHistory].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-3 bg-[#0d0000]/50 rounded-sm px-4 py-3">
                    <span className={`font-body text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 self-start mt-0.5 ${STATUS_STYLES[entry.status]}`}>
                      {entry.status}
                    </span>
                    <div className="min-w-0">
                      {entry.note && <p className="font-body text-sm text-[#FFF8F0]/70">{entry.note}</p>}
                      <p className="font-body text-xs text-[#FFF8F0]/30 mt-0.5">{fmtFull(entry.changedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </motion.div>
  )
}
