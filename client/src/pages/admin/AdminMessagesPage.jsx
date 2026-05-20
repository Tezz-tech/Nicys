import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdmin } from '../../context/AdminContext'

export default function AdminMessagesPage() {
  const { api }     = useAdmin()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setLoading(true)
    api().get('/api/admin/contacts')
      .then(({ data }) => setContacts(data.contacts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [api])

  const fmt = (iso) => new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#FFF8F0] mb-1">Messages</h1>
        <p className="font-body text-xs text-[#FFF8F0]/30">
          {loading ? 'Loading…' : `${contacts.length} message${contacts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {!loading && contacts.length === 0 && (
        <div className="bg-[#1a0a0a] border border-[#800000]/12 rounded-sm p-12 text-center">
          <p className="font-body text-sm text-[#FFF8F0]/30">No contact messages yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {contacts.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-[#1a0a0a] border border-[#800000]/12 rounded-sm overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === c._id ? null : c._id)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[#800000]/5 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#800000]/15 flex items-center justify-center shrink-0">
                <span className="font-display text-sm font-semibold text-[#800000]">{c.name[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#FFF8F0]/80">{c.name}</p>
                <p className="font-body text-xs text-[#FFF8F0]/40 truncate">{c.email}</p>
              </div>
              <p className="font-body text-xs text-[#FFF8F0]/30 hidden sm:block shrink-0">{fmt(c.createdAt)}</p>
              <span className={`text-[#FFF8F0]/30 transition-transform duration-200 ${expanded === c._id ? 'rotate-90' : ''}`}>›</span>
            </button>

            <AnimatePresence>
              {expanded === c._id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-1 border-t border-[#800000]/8">
                    <p className="font-body text-sm text-[#FFF8F0]/70 leading-relaxed whitespace-pre-wrap mb-4">{c.message}</p>
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-block font-body text-xs font-semibold tracking-widest uppercase text-[#800000] hover:text-[#b490e8] transition-colors"
                    >
                      Reply via Email →
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
