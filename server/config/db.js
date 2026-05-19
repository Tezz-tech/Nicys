const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nicys'

const OPTIONS = {
  serverSelectionTimeoutMS: 15000,  // Give Atlas 15 s to respond
  socketTimeoutMS:          45000,
  connectTimeoutMS:         15000,
  maxPoolSize:              10,
  retryWrites:              true,
}

async function connectDB(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(MONGO_URI, OPTIONS)
      const host = conn.connection.host
      console.log(`✅  MongoDB connected: ${host}`)
      return
    } catch (err) {
      console.error(`❌  MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`)
      if (attempt === retries) {
        console.error('    Could not connect to MongoDB. The server will run but database operations will fail.')
        console.error('    Check that MONGO_URI in .env is correct and the cluster is accessible.')
        // Do NOT process.exit — let the Express server stay up so you can
        // still diagnose via /api/health and fix config without restarting
        return
      }
      await new Promise(r => setTimeout(r, delayMs * attempt))
    }
  }
}

// Reconnect on unexpected disconnect
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — attempting reconnect…')
  connectDB(3, 5000)
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message)
})

module.exports = connectDB
