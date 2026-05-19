import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import OrderDetail from '../components/admin/OrderDetail'

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  'Received':    'bg-amber-500/15 text-amber-300 border border-amber-400/25',
  'In Progress': 'bg-blue-500/15 text-blue-300 border border-blue-400/25',
  'Complete':    'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25',
  'Delivered':   'bg-[#C8A4D4]/15 text-[#C8A4D4] border border-[#C8A4D4]/25',
}

const STATUS_OPTIONS = ['', 'Received', 'In Progress', 'Complete', 'Delivered']

const NAV = [
  { id: 'overview',  label: 'Overview',  icon: '◈' },
  { id: 'orders',    label: 'Orders',    icon: '✉' },
  { id: 'contacts',  label: 'Messages',  icon: '✦' },
]

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, accent, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1B2A4A] border border-[#C8A4D4]/12 rounded-sm p-5"
    >
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/35 mb-3">{label}</p>
      <p className={`font-display text-4xl font-semibold ${accent || 'text-[#FFF8F0]'}`}>{value ?? '—'}</p>
      {sub && <p className="font-body text-xs text-[#FFF8F0]/30 mt-1">{sub}</p>}
    </motion.div>
  )
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  return (
    <span className={`font-body text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || 'bg-white/10 text-white/50'}`}>
      {status}
    </span>
  )
}

// ─── Overview View ───────────────────────────────────────────────────────────

function OverviewView({ stats, onViewOrder }) {
  if (!stats) return <div className="text-[#FFF8F0]/30 font-body text-sm p-8">Loading…</div>
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders"  value={stats.total}      />
        <StatCard label="Received"      value={stats.received}   accent="text-amber-300"    />
        <StatCard label="In Progress"   value={stats.inProgress} accent="text-blue-300"     />
        <StatCard label="Delivered"     value={stats.delivered}  accent="text-[#C8A4D4]"    />
      </div>

      <div>
        <h3 className="font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/35 mb-4">Recent Orders</h3>
        <div className="bg-[#1B2A4A] border border-[#C8A4D4]/12 rounded-sm overflow-hidden">
          {stats.recent?.length === 0 && (
            <p className="font-body text-sm text-[#FFF8F0]/30 p-6">No orders yet.</p>
          )}
          {stats.recent?.map((o, i) => (
            <motion.button
              key={o._id || i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onViewOrder(o.orderId)}
              className="w-full flex items-center gap-4 px-5 py-4 border-b border-[#C8A4D4]/8 last:border-0 hover:bg-[#C8A4D4]/5 transition-colors text-left group"
            >
              <span className="font-body text-xs font-bold tracking-wider text-[#C8A4D4] w-32 shrink-0">{o.orderId}</span>
              <span className="font-body text-sm text-[#FFF8F0]/70 flex-1 truncate">{o.senderName}</span>
              <span className="font-body text-sm text-[#FFF8F0]/40 hidden md:block">→ {o.recipientName}</span>
              <StatusBadge status={o.status} />
              <span className="text-[#FFF8F0]/20 group-hover:text-[#C8A4D4]/50 transition-colors ml-2">›</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Orders View ─────────────────────────────────────────────────────────────

function OrdersView({ onSelect }) {
  const { api } = useAdmin()
  const [orders, setOrders]         = useState([])
  const [total, setTotal]           = useState(0)
  const [page, setPage]             = useState(1)
  const [pages, setPages]           = useState(1)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('')
  const [loading, setLoading]       = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 15 }
      if (search)       params.search = search
      if (statusFilter) params.status = statusFilter
      const { data } = await api().get('/api/admin/orders', { params })
      setOrders(data.orders)
      setTotal(data.total)
      setPages(data.pages)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [api, page, search, statusFilter])

  useEffect(() => { fetch() }, [fetch])

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by ID, name or email…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 bg-[#1B2A4A] border border-[#C8A4D4]/20 rounded-sm px-4 py-2.5 font-body text-sm text-[#FFF8F0]/80 placeholder-[#FFF8F0]/25 focus:outline-none focus:border-[#C8A4D4]/50 transition-colors"
        />
        <select
          value={statusFilter}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-[#1B2A4A] border border-[#C8A4D4]/20 rounded-sm px-4 py-2.5 font-body text-sm text-[#FFF8F0]/70 focus:outline-none focus:border-[#C8A4D4]/50 transition-colors"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s || 'All Statuses'}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="font-body text-xs text-[#FFF8F0]/30">
        {loading ? 'Loading…' : `${total} order${total !== 1 ? 's' : ''} found`}
      </p>

      {/* Table */}
      <div className="bg-[#1B2A4A] border border-[#C8A4D4]/12 rounded-sm overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[140px_1fr_1fr_120px_100px_36px] gap-4 px-5 py-3 border-b border-[#C8A4D4]/12 bg-[#0d1627]/40">
          {['Order ID', 'Customer', 'Recipient', 'Date', 'Status', ''].map(h => (
            <span key={h} className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#FFF8F0]/30">{h}</span>
          ))}
        </div>

        {!loading && orders.length === 0 && (
          <p className="font-body text-sm text-[#FFF8F0]/30 p-8 text-center">No orders match your search.</p>
        )}

        {orders.map((o, i) => (
          <motion.button
            key={o._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onSelect(o)}
            className="w-full grid md:grid-cols-[140px_1fr_1fr_120px_100px_36px] gap-4 px-5 py-4 border-b border-[#C8A4D4]/8 last:border-0 hover:bg-[#C8A4D4]/5 transition-colors text-left group items-center"
          >
            <span className="font-body text-xs font-bold tracking-wider text-[#C8A4D4]">{o.orderId}</span>
            <div className="min-w-0">
              <p className="font-body text-sm text-[#FFF8F0]/80 truncate">{o.senderName}</p>
              <p className="font-body text-xs text-[#FFF8F0]/35 truncate">{o.senderEmail}</p>
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm text-[#FFF8F0]/70 truncate">{o.recipientName}</p>
              <p className="font-body text-xs text-[#FFF8F0]/35 truncate">{o.occasion}</p>
            </div>
            <span className="font-body text-xs text-[#FFF8F0]/40">{fmt(o.createdAt)}</span>
            <StatusBadge status={o.status} />
            <span className="text-[#FFF8F0]/20 group-hover:text-[#C8A4D4]/60 transition-colors text-lg">›</span>
          </motion.button>
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 font-body text-xs text-[#FFF8F0]/50 hover:text-[#FFF8F0] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="font-body text-xs text-[#FFF8F0]/30">
            Page {page} of {pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 font-body text-xs text-[#FFF8F0]/50 hover:text-[#FFF8F0] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Contacts View ───────────────────────────────────────────────────────────

function ContactsView() {
  const { api } = useAdmin()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(false)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    api().get('/api/admin/contacts').then(({ data }) => {
      setContacts(data.contacts)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [api])

  const fmt = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-3">
      <p className="font-body text-xs text-[#FFF8F0]/30">{loading ? 'Loading…' : `${contacts.length} message${contacts.length !== 1 ? 's' : ''}`}</p>
      {contacts.length === 0 && !loading && (
        <p className="font-body text-sm text-[#FFF8F0]/30 p-8 text-center bg-[#1B2A4A] border border-[#C8A4D4]/12 rounded-sm">No contact messages yet.</p>
      )}
      {contacts.map((c, i) => (
        <motion.div
          key={c._id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-[#1B2A4A] border border-[#C8A4D4]/12 rounded-sm overflow-hidden"
        >
          <button
            onClick={() => setExpanded(expanded === c._id ? null : c._id)}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#C8A4D4]/5 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#C8A4D4]/15 flex items-center justify-center shrink-0">
              <span className="font-display text-sm font-semibold text-[#C8A4D4]">{c.name[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-semibold text-[#FFF8F0]/80">{c.name}</p>
              <p className="font-body text-xs text-[#FFF8F0]/40 truncate">{c.email}</p>
            </div>
            <p className="font-body text-xs text-[#FFF8F0]/30 hidden sm:block shrink-0">{fmt(c.createdAt)}</p>
            <span className={`text-[#FFF8F0]/30 transition-transform ${expanded === c._id ? 'rotate-90' : ''}`}>›</span>
          </button>
          <AnimatePresence>
            {expanded === c._id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 pt-1 border-t border-[#C8A4D4]/8">
                  <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap">{c.message}</p>
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-block mt-4 font-body text-xs font-semibold tracking-widest uppercase text-[#C8A4D4] hover:text-[#b990c7] transition-colors"
                  >
                    Reply via email →
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { api, logout } = useAdmin()
  const navigate = useNavigate()
  const [view, setView]           = useState('overview')
  const [stats, setStats]         = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    api().get('/api/admin/stats').then(({ data }) => setStats(data)).catch(() => {})
  }, [api])

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }) }

  const openOrderById = async (orderId) => {
    try {
      const { data } = await api().get(`/api/admin/orders/${orderId}`)
      setSelectedOrder(data)
      setView('orders')
    } catch { /* silent */ }
  }

  const handleStatusUpdated = (updatedOrder) => {
    setSelectedOrder(updatedOrder)
    // Refresh stats
    api().get('/api/admin/stats').then(({ data }) => setStats(data)).catch(() => {})
  }

  return (
    <div className="min-h-screen bg-[#0d1627] flex">
      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-60 bg-[#1B2A4A] border-r border-[#C8A4D4]/12
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-6 py-7 border-b border-[#C8A4D4]/12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#C8A4D4]/30 bg-[#C8A4D4]/10 flex items-center justify-center">
              <span className="font-display text-base font-semibold text-[#C8A4D4]">N</span>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-[#FFF8F0]">Nicys</p>
              <p className="font-body text-[10px] tracking-widest uppercase text-[#FFF8F0]/30">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setView(id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm transition-all ${
                view === id
                  ? 'bg-[#C8A4D4]/15 text-[#C8A4D4] font-semibold'
                  : 'text-[#FFF8F0]/45 hover:bg-[#FFF8F0]/5 hover:text-[#FFF8F0]/70'
              }`}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
              {id === 'orders' && stats?.received > 0 && (
                <span className="ml-auto bg-amber-500/20 text-amber-300 border border-amber-400/25 font-body text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {stats.received}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-5 border-t border-[#C8A4D4]/12 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-[#FFF8F0]/35 hover:text-[#FFF8F0]/60 hover:bg-[#FFF8F0]/5 transition-all"
          >
            <span className="text-base w-5 text-center">↗</span>
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-body text-sm text-[#FFF8F0]/35 hover:text-[#D4A5A5] hover:bg-[#D4A5A5]/5 transition-all"
          >
            <span className="text-base w-5 text-center">⟵</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 px-6 py-4 border-b border-[#C8A4D4]/12 bg-[#0d1627]/80 backdrop-blur-sm shrink-0 sticky top-0 z-10">
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-[#FFF8F0]/50 hover:text-[#FFF8F0] transition-colors"
          >
            ☰
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl font-semibold text-[#FFF8F0]">
              {NAV.find(n => n.id === view)?.label || 'Dashboard'}
            </h1>
            {stats && (
              <p className="font-body text-xs text-[#FFF8F0]/30">
                {stats.total} orders total · {stats.inProgress} in progress
              </p>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {view === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OverviewView stats={stats} onViewOrder={openOrderById} />
              </motion.div>
            )}
            {view === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <OrdersView onSelect={setSelectedOrder} />
              </motion.div>
            )}
            {view === 'contacts' && (
              <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ContactsView />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── Order Detail Slide-over ── */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdated={handleStatusUpdated}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
