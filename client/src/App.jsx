import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar               from './components/layout/Navbar'
import Footer               from './components/layout/Footer'
import FloatingPetals       from './components/ui/FloatingPetals'
import Home                 from './pages/Home'
import Services             from './pages/Services'
import Packages             from './pages/Packages'
import Order                from './pages/Order'
import Track                from './pages/Track'
import Contact              from './pages/Contact'
import AdminLogin           from './pages/AdminLogin'
import AdminLayout          from './pages/admin/AdminLayout'
import AdminOverviewPage    from './pages/admin/AdminOverviewPage'
import AdminOrdersPage      from './pages/admin/AdminOrdersPage'
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage'
import AdminMessagesPage    from './pages/admin/AdminMessagesPage'
import { OrderProvider }    from './context/OrderContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import ScrollToTop          from './components/ui/ScrollToTop'

function AdminGuard() {
  const { isAuthenticated } = useAdmin()
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />
}

function AppInner() {
  const location = useLocation()
  const isAdmin  = location.pathname.startsWith('/admin')

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${isAdmin ? 'bg-[#0d0000] admin-area' : 'bg-cream'}`}>
      {!isAdmin && <FloatingPetals />}
      {!isAdmin && <Navbar />}

      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/"         element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/order"    element={<Order />} />
          <Route path="/track"    element={<Track />} />
          <Route path="/contact"  element={<Contact />} />

          {/* Admin login — no shell */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin shell */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index                  element={<AdminOverviewPage />} />
              <Route path="orders"          element={<AdminOrdersPage />} />
              <Route path="orders/:id"      element={<AdminOrderDetailPage />} />
              <Route path="messages"        element={<AdminMessagesPage />} />
            </Route>
          </Route>
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
