import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || ''

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('nicys_admin_token'))

  const login = useCallback((newToken) => {
    setToken(newToken)
    localStorage.setItem('nicys_admin_token', newToken)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem('nicys_admin_token')
  }, [])

  const api = useCallback(() => axios.create({
    baseURL: BASE,
    headers: { Authorization: `Bearer ${token}` },
  }), [token])

  return (
    <AdminContext.Provider value={{ token, isAuthenticated: !!token, login, logout, api }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}
