import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { useAdmin } from '../context/AdminContext'

export default function AdminLogin() {
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const navigate  = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/admin/login', form)
      login(data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1627] flex items-center justify-center p-6">
      {/* Background grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-[#C8A4D4]/30 bg-[#C8A4D4]/10 mb-5">
            <span className="font-display text-2xl font-semibold text-[#C8A4D4]">N</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#FFF8F0] mb-1">Nicys Studio</h1>
          <p className="font-body text-sm text-[#FFF8F0]/40 tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#1B2A4A] border border-[#C8A4D4]/15 rounded-sm p-8 shadow-2xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/50 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="admin@nicys.ng"
                className="w-full bg-[#0d1627] border border-[#C8A4D4]/20 rounded-sm px-4 py-3 font-body text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/25 focus:outline-none focus:border-[#C8A4D4]/60 transition-colors"
              />
            </div>

            <div>
              <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#FFF8F0]/50 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••••"
                className="w-full bg-[#0d1627] border border-[#C8A4D4]/20 rounded-sm px-4 py-3 font-body text-sm text-[#FFF8F0] placeholder-[#FFF8F0]/25 focus:outline-none focus:border-[#C8A4D4]/60 transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-body text-xs font-medium text-[#D4A5A5] bg-[#D4A5A5]/10 border border-[#D4A5A5]/20 px-4 py-3 rounded-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A4D4] hover:bg-[#b990c7] disabled:opacity-50 text-[#1B2A4A] font-body font-semibold text-sm tracking-widest uppercase py-3 rounded-sm transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-[#FFF8F0]/20 mt-8">
          Nicys Creative Studio — Admin Access Only
        </p>
      </motion.div>
    </div>
  )
}
