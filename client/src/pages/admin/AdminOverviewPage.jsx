import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAdmin } from '../../context/AdminContext'

const STATUS_STYLES = {
  'Received':    'bg-amber-500/15 text-amber-300 border border-amber-400/25',
  'In Progress': 'bg-blue-500/15 text-blue-300 border border-blue-400/25',
  'Complete':    'bg-emerald-500/15 text-emerald-300 border border-emerald-400/25',
  'Delivered':   'bg-[#C4A8F0]/15 text-[#C4A8F0] border border-[#C4A8F0]/25',
}

function StatCard({ label, value, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1B2A4A] border border-[#C4A8F0]/12 rounded-sm p-5"
    >
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/35 mb-3">{label}</p>
      <p className={`font-display text-4xl font-semibold ${accent || 'text-[#FFF8F0]'}`}>{value ?? '—'}</p>
    </motion.div>
  )
}

export default function AdminOverviewPage() {
  const { api }     = useAdmin()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api().get('/api/admin/stats').then(({ data }) => setStats(data)).catch(() => {})
  }, [api])

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#FFF8F0] mb-1">Overview</h1>
        {stats && (
          <p className="font-body text-xs text-[#FFF8F0]/30">
            {stats.total} orders total · {stats.inProgress} in progress
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders"  value={stats?.total}      />
        <StatCard label="Received"      value={stats?.received}   accent="text-amber-300"    />
        <StatCard label="In Progress"   value={stats?.inProgress} accent="text-blue-300"     />
        <StatCard label="Delivered"     value={stats?.delivered}  accent="text-[#C4A8F0]"    />
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/35">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="font-body text-xs text-[#C4A8F0] hover:text-[#b990c7] transition-colors tracking-widest uppercase"
          >
            View All →
          </Link>
        </div>

        <div className="bg-[#1B2A4A] border border-[#C4A8F0]/12 rounded-sm overflow-hidden">
          {!stats && (
            <p className="font-body text-sm text-[#FFF8F0]/30 p-6">Loading…</p>
          )}
          {stats?.recent?.length === 0 && (
            <p className="font-body text-sm text-[#FFF8F0]/30 p-6">No orders yet.</p>
          )}
          {stats?.recent?.map((o, i) => (
            <Link
              key={o._id || i}
              to={`/admin/orders/${o.orderId}`}
              className="flex items-center gap-4 px-5 py-4 border-b border-[#C4A8F0]/8 last:border-0 hover:bg-[#C4A8F0]/5 transition-colors group"
            >
              <span className="font-body text-xs font-bold tracking-wider text-[#C4A8F0] w-32 shrink-0">{o.orderId}</span>
              <span className="font-body text-sm text-[#FFF8F0]/70 flex-1 truncate">{o.senderName}</span>
              <span className="font-body text-sm text-[#FFF8F0]/40 hidden md:block">→ {o.recipientName}</span>
              <span className={`font-body text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full ${STATUS_STYLES[o.status] || ''}`}>
                {o.status}
              </span>
              <span className="text-[#FFF8F0]/20 group-hover:text-[#C4A8F0]/50 transition-colors">›</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
