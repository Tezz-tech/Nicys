import axios from 'axios'

// In development Vite proxies /api → localhost:5000 (baseURL = '').
// In production VITE_API_URL points to the deployed backend.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export default api
