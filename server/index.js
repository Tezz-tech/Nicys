require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const express  = require('express')
const cors     = require('cors')
const path     = require('path')
const connectDB = require('./config/db')

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
const allowedOrigins = [
  (process.env.CLIENT_URL || '').replace(/\/$/, ''),
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // allow server-to-server / curl / Postman (no origin header)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: ${origin} not allowed`))
  },
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/orders',  require('./routes/orders'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/admin',   require('./routes/admin'))

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[Error]', err.message)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`\n🌿 Nicys server running on port ${PORT}\n`))
