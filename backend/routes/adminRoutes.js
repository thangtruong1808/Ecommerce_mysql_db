/**
 * Admin Routes
 * Handles all admin-only API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import * as userModel from '../models/userModel.js'
import * as productModel from '../models/productModel.js'
import * as orderModel from '../models/orderModel.js'
import * as invoiceModel from '../models/invoiceModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, admin)

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const db = (await import('../config/db.js')).default

    // Get total sales
    const [salesResult] = await db.execute(
      'SELECT SUM(total_price) as total_sales FROM orders WHERE is_paid = 1'
    )

    // Get total orders
    const [ordersResult] = await db.execute('SELECT COUNT(*) as total FROM orders')

    // Get total users
    const [usersResult] = await db.execute('SELECT COUNT(*) as total FROM users')

    // Get total products
    const [productsResult] = await db.execute('SELECT COUNT(*) as total FROM products')

    // Get recent orders
    const [recentOrders] = await db.execute(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 5`
    )

    // Get low stock products
    const [lowStock] = await db.execute(
      'SELECT * FROM products WHERE stock < 10 ORDER BY stock ASC LIMIT 5'
    )

    res.json({
      sales: {
        total: parseFloat(salesResult[0].total_sales || 0),
      },
      orders: {
        total: ordersResult[0].total,
      },
      users: {
        total: usersResult[0].total,
      },
      products: {
        total: productsResult[0].total,
      },
      recentOrders,
      lowStockProducts: lowStock,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/users
 * Get all users with pagination
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const result = await userModel.getAllUsers(page)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/users/:id
 * Update user (role, etc.)
 */
router.put('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)
    const { role } = req.body

    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const updatedUser = await userModel.updateUserRole(userId, role)
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)
    
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }

    const db = (await import('../config/db.js')).default
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [userId])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/orders
 * Get all orders with filters
 */
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const status = req.query.status || null
    const result = await orderModel.getAllOrders({ page, status })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/products
 * Get all products for admin management
 */
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const result = await productModel.getAllProducts({ page, limit })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/invoices
 * Get all invoices
 */
router.get('/invoices', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const result = await invoiceModel.getAllInvoices({ page })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

