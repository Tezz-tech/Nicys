import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar         from './components/layout/Navbar'
import Footer         from './components/layout/Footer'
import CursorGlow     from './components/three/CursorGlow'
import FloatingPetals from './components/ui/FloatingPetals'
import Home           from './pages/Home'
import Services       from './pages/Services'
import Packages       from './pages/Packages'
import Order          from './pages/Order'
import Track          from './pages/Track'
import Contact        from './pages/Contact'
import AdminLogin     from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { OrderProvider } from './context/OrderContext'
import { AdminProvider, useAdmin } from './context/AdminContext'

function AdminRoute() {
  const { isAuthenticated } = useAdmin()
  return isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
}

function AppInner() {
  const location  = useLocation()
  const isAdmin   = location.pathname.startsWith('/admin')

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${isAdmin ? 'bg-[#0d1627] admin-area' : 'bg-cream'}`}>
      {!isAdmin && <FloatingPetals />}
      {!isAdmin && <CursorGlow />}
      {!isAdmin && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/"          element={<Home />} />
          <Route path="/services"  element={<Services />} />
          <Route path="/packages"  element={<Packages />} />
          <Route path="/order"     element={<Order />} />
          <Route path="/track"     element={<Track />} />
          <Route path="/contact"   element={<Contact />} />

          {/* Admin routes — no public layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin"       element={<AdminRoute />} />
          <Route path="/admin/*"     element={<AdminRoute />} />
        </Routes>
      </AnimatePresence>

      {!isAdmin && <Footer key={location.pathname} />}
    </div>
  )
}

export default function App() {
  return (
    <AdminProvider>
      <OrderProvider>
        <AppInner />
      </OrderProvider>
    </AdminProvider>
  )
}
