import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const NAV = [
  { to: '/admin',          label: 'Overview',  end: true },
  { to: '/admin/orders',   label: 'Orders'              },
  { to: '/admin/messages', label: 'Messages'             },
]

export default function AdminLayout() {
  const { logout } = useAdmin()
  const navigate   = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0d0000] flex flex-col">

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-30 bg-[#0d0000]/95 backdrop-blur-sm border-b border-[#800000]/12">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center gap-8 h-16">

          {/* Logo */}
          <a href="/" target="_blank" rel="noreferrer" className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Nicys"
              className="h-20 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)', maxWidth: '220px' }}
            />
          </a>

          {/* Page links */}
          <nav className="flex items-center gap-1 flex-1">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `font-body text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#800000]/15 text-[#800000]'
                      : 'text-[#FFF8F0]/40 hover:text-[#FFF8F0]/70 hover:bg-[#FFF8F0]/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="font-body text-[11px] text-[#FFF8F0]/30 hover:text-[#FFF8F0]/60 transition-colors tracking-widest uppercase"
            >
              View Site ↗
            </a>
            <button
              onClick={handleLogout}
              className="font-body text-[11px] text-[#FFF8F0]/30 hover:text-[#E8A0B4] transition-colors tracking-widest uppercase"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
