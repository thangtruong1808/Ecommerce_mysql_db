/**
 * Express Server
 * Main server file for the ecommerce backend API
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import voucherRoutes from './routes/voucherRoutes.js'

dotenv.config()

// Connect to database
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

// CORS configuration for cookies
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies
}

// Middleware
app.use(helmet())
app.use(limiter)
app.use(cors(corsOptions))
app.use(cookieParser()) // Parse cookies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api', reviewRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', commentRoutes)
app.use('/api', likeRoutes)
app.use('/api', voucherRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!', error: err.message })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

