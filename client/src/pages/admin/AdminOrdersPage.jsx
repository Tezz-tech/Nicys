import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../../context/AdminContext'

const STATUS_STYLES = {
  'Received':    'bg-amber-500/15 text-amber-300 border border-amber-400/25',
  'In Progress': 'bg-blue-500/15 text-blue-300 border border-blue-400/25',
  'Complete':    'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25',
  'Delivered':   'bg-[#C4A8F0]/15 text-[#C4A8F0] border border-[#C4A8F0]/25',
}

const STATUS_OPTIONS = ['', 'Received', 'In Progress', 'Complete', 'Delivered']

export default function AdminOrdersPage() {
  const { api }     = useAdmin()
  const [orders, setOrders]       = useState([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [pages, setPages]         = useState(1)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('')
  const [loading, setLoading]     = useState(false)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (search)       params.search = search
      if (statusFilter) params.status = statusFilter
      const { data } = await api().get('/api/admin/orders', { params })
      setOrders(data.orders)
      setTotal(data.total)
      setPages(data.pages)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [api, page, search, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#FFF8F0] mb-1">Orders</h1>
        <p className="font-body text-xs text-[#FFF8F0]/30">
          {loading ? 'Loading…' : `${total} order${total !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by ID, name or email…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 bg-[#1B2A4A] border border-[#C4A8F0]/20 rounded-sm px-4 py-2.5 font-body text-sm text-[#FFF8F0]/80 placeholder-[#FFF8F0]/25 focus:outline-none focus:border-[#C4A8F0]/50 transition-colors"
        />
        <select
          value={statusFilter}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-[#1B2A4A] border border-[#C4A8F0]/20 rounded-sm px-4 py-2.5 font-body text-sm text-[#FFF8F0]/70 focus:outline-none focus:border-[#C4A8F0]/50 transition-colors"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s || 'All Statuses'}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1B2A4A] border border-[#C4A8F0]/12 rounded-sm overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[140px_1fr_1fr_120px_120px_36px] gap-4 px-5 py-3 border-b border-[#C4A8F0]/12 bg-[#0d1627]/40">
          {['Order ID', 'Customer', 'Recipient', 'Date', 'Status', ''].map(h => (
            <span key={h} className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#FFF8F0]/30">{h}</span>
          ))}
        </div>

        {!loading && orders.length === 0 && (
          <p className="font-body text-sm text-[#FFF8F0]/30 p-8 text-center">No orders match your search.</p>
        )}

        {orders.map((o, i) => (
          <motion.div key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}>
            <Link
              to={`/admin/orders/${o.orderId}`}
              className="flex md:grid md:grid-cols-[140px_1fr_1fr_120px_120px_36px] gap-4 px-5 py-4 border-b border-[#C4A8F0]/8 last:border-0 hover:bg-[#C4A8F0]/5 transition-colors group items-center"
            >
              <span className="font-body text-xs font-bold tracking-wider text-[#C4A8F0]">{o.orderId}</span>
              <div className="min-w-0 flex-1 md:flex-none">
                <p className="font-body text-sm text-[#FFF8F0]/80 truncate">{o.senderName}</p>
                <p className="font-body text-xs text-[#FFF8F0]/35 truncate">{o.senderEmail}</p>
              </div>
              <div className="min-w-0 hidden md:block">
                <p className="font-body text-sm text-[#FFF8F0]/70 truncate">{o.recipientName}</p>
                <p className="font-body text-xs text-[#FFF8F0]/35 truncate">{o.letterCollection}</p>
              </div>
              <span className="font-body text-xs text-[#FFF8F0]/40 hidden md:block">{fmt(o.createdAt)}</span>
              <span className={`font-body text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] || 'bg-white/10 text-white/50'}`}>
                {o.status}
              </span>
              <span className="text-[#FFF8F0]/20 group-hover:text-[#C4A8F0]/60 transition-colors text-lg">›</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 font-body text-xs text-[#FFF8F0]/50 hover:text-[#FFF8F0] disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            ← Prev
          </button>
          <span className="font-body text-xs text-[#FFF8F0]/30">Page {page} of {pages}</span>
          <button
            disabled={page >= pages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 font-body text-xs text-[#FFF8F0]/50 hover:text-[#FFF8F0] disabled:opacity-20 disabled:pointer-events-none transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
