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
import * as analyticsModel from '../models/analyticsModel.js'
import * as reviewModel from '../models/reviewModel.js'
import * as commentModel from '../models/commentModel.js'
import * as voucherModel from '../models/voucherModel.js'
import * as bulkOperationsModel from '../models/bulkOperationsModel.js'
import { validateBulkOperation, validateOrderStatusTransition, validateProductDeletion, validateUserDeletion } from '../middleware/validationMiddleware.js'
import bcrypt from 'bcryptjs'
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
 * GET /api/admin/stats/overview
 * Get dashboard overview with all key metrics
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const db = (await import('../config/db.js')).default

    // Get sales overview
    const salesOverview = await analyticsModel.getSalesOverview(period, startDate, endDate)

    // Get order statistics
    const orderStats = await analyticsModel.getOrderStatistics(period, startDate, endDate)

    // Get customer insights
    const customerInsights = await analyticsModel.getCustomerInsights(period, startDate, endDate)

    // Get inventory overview
    const inventory = await analyticsModel.getInventoryOverview()

    // Get performance metrics
    const performance = await analyticsModel.getPerformanceMetrics(period, startDate, endDate)

    // Get recent orders
    const [recentOrders] = await db.execute(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 5`
    )

    res.json({
      sales: {
        total: salesOverview.totalSales,
        growth: salesOverview.growth
      },
      orders: {
        total: orderStats.total,
        growth: orderStats.growth
      },
      users: {
        total: customerInsights.totalCustomers,
        new: customerInsights.newCustomers,
        growth: customerInsights.growth
      },
      products: {
        total: inventory.totalProducts
      },
      recentOrders,
      lowStockProducts: inventory.lowStockProducts,
      performance
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/sales
 * Get sales analytics with time period support
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/sales', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const salesOverview = await analyticsModel.getSalesOverview(period, startDate, endDate)
    const salesTrend = await analyticsModel.getSalesTrend(period, 'day', startDate, endDate)
    
    res.json({
      overview: salesOverview,
      trend: salesTrend
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/orders
 * Get order statistics and trends
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/orders', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const orderStats = await analyticsModel.getOrderStatistics(period, startDate, endDate)
    
    res.json(orderStats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/customers
 * Get customer insights and growth
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/customers', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const customerInsights = await analyticsModel.getCustomerInsights(period, startDate, endDate)
    
    res.json(customerInsights)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/inventory
 * Get inventory management data
 * Note: Inventory data is not time-period dependent
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/inventory', async (req, res) => {
  try {
    const inventory = await analyticsModel.getInventoryOverview()
    
    res.json(inventory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/revenue-chart
 * Get revenue data for charts (supports daily/weekly/monthly)
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/revenue-chart', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    let groupBy = 'day'
    
    // Determine groupBy based on period
    if (period === 'year') {
      groupBy = 'month'
    } else if (period === 'month') {
      groupBy = 'day'
    } else if (period === 'week') {
      groupBy = 'day'
    } else {
      groupBy = 'day'
    }
    
    const revenueData = await analyticsModel.getSalesTrend(period, groupBy, startDate, endDate)
    
    res.json(revenueData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/revenue-by-category
 * Get revenue breakdown by category (for pie charts)
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/revenue-by-category', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const categoryData = await analyticsModel.getRevenueByCategory(period, startDate, endDate)
    
    res.json(categoryData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/top-products
 * Get top selling products
 * Query params: period (today, week, month, year, all), startDate, endDate, limit
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/top-products', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const limit = parseInt(req.query.limit) || 10
    const topProducts = await analyticsModel.getTopProducts(period, limit, startDate, endDate)
    
    res.json(topProducts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/recent-activity
 * Get recent orders, reviews, comments, registrations
 * Query params: limit (default: 15)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/recent-activity', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15
    const activities = await analyticsModel.getRecentActivity(limit)
    
    res.json(activities)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/stats/performance
 * Get performance metrics (conversion rate, AOV, etc.)
 * Query params: period (today, week, month, year, all), startDate, endDate
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/stats/performance', async (req, res) => {
  try {
    const period = req.query.period || 'month'
    const startDate = req.query.startDate || null
    const endDate = req.query.endDate || null
    const performance = await analyticsModel.getPerformanceMetrics(period, startDate, endDate)
    
    res.json(performance)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/users
 * Get all users with pagination, search, and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || null
    const role = req.query.role || null
    const result = await userModel.getAllUsers(page, limit, search, role)
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
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/users/:id', validateUserDeletion, async (req, res) => {
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
 * Get all orders with filters and search
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const status = req.query.status || null
    const search = req.query.search || null
    const result = await orderModel.getAllOrders({ page, limit, status, search })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/products
 * Get all products for admin management with search and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const search = req.query.search || null
    const stock = req.query.stock || null
    const filters = { page, limit, search }
    if (stock === 'low_stock') {
      filters.minStock = 0
      filters.maxStock = 10
    } else if (stock === 'out_of_stock') {
      filters.minStock = 0
      filters.maxStock = 0
    } else if (stock === 'in_stock') {
      filters.minStock = 1
    }
    const result = await productModel.getAllProducts(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/invoices
 * Get all invoices with pagination, search, and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/invoices', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      paymentStatus: req.query.paymentStatus || null
    }
    const result = await invoiceModel.getAllInvoices(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/invoices/:id
 * Get invoice details
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/invoices/:id', async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id)
    
    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: 'Invalid invoice ID' })
    }
    
    const invoice = await invoiceModel.getInvoiceById(invoiceId, null)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    
    res.json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/invoices/:id
 * Update invoice (payment status, email sent status)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/invoices/:id', async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id)
    const { payment_status, email_sent } = req.body
    
    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: 'Invalid invoice ID' })
    }
    
    const invoice = await invoiceModel.getInvoiceById(invoiceId, null)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    
    const updateData = {}
    if (payment_status !== undefined) updateData.payment_status = payment_status
    if (email_sent !== undefined) updateData.email_sent = email_sent === true || email_sent === 'true'
    
    const updated = await invoiceModel.updateInvoice(invoiceId, updateData)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update invoice' })
    }
    
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/invoices/:id
 * Delete invoice (with validation)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/invoices/:id', async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id)
    
    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: 'Invalid invoice ID' })
    }
    
    const invoice = await invoiceModel.getInvoiceById(invoiceId, null)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    
    // Note: Invoices are linked to orders with RESTRICT, so deletion should be careful
    // In a real scenario, you might want to archive instead of delete
    const deleted = await invoiceModel.deleteInvoice(invoiceId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete invoice' })
    }
    
    res.json({ message: 'Invoice deleted successfully' })
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: 'Cannot delete invoice. It is referenced by an order.' })
    }
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/invoices/:id/resend-email
 * Resend invoice email
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/invoices/:id/resend-email', async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id)
    
    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: 'Invalid invoice ID' })
    }
    
    const invoice = await invoiceModel.getInvoiceById(invoiceId, null)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    
    // Send invoice email
    const { sendInvoiceEmail } = await import('../utils/emailService.js')
    const emailResult = await sendInvoiceEmail(
      invoice.user_email,
      invoice.user_name || 'Customer',
      invoice
    )
    
    if (emailResult.success) {
      await invoiceModel.markInvoiceEmailSent(invoiceId)
      res.json({ message: 'Invoice email sent successfully', invoice: await invoiceModel.getInvoiceById(invoiceId, null) })
    } else {
      res.status(500).json({ message: emailResult.message || 'Failed to send invoice email' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/invoices/bulk-delete
 * Bulk delete invoices
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/invoices/bulk-delete', async (req, res) => {
  try {
    const { invoiceIds } = req.body
    
    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({ message: 'Invoice IDs array is required' })
    }
    
    const deleted = []
    const errors = []
    
    for (const invoiceId of invoiceIds) {
      try {
        const id = parseInt(invoiceId)
        if (isNaN(id) || id <= 0) {
          errors.push({ id: invoiceId, error: 'Invalid invoice ID' })
          continue
        }
        
        const result = await invoiceModel.deleteInvoice(id)
        if (result) {
          deleted.push(id)
        } else {
          errors.push({ id, error: 'Invoice not found' })
        }
      } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
          errors.push({ id: invoiceId, error: 'Referenced by order' })
        } else {
          errors.push({ id: invoiceId, error: error.message })
        }
      }
    }
    
    res.json({
      message: `${deleted.length} invoice(s) deleted successfully`,
      deleted,
      errors
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/order-items
 * Get all order items with pagination and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/order-items', async (req, res) => {
  try {
    const db = (await import('../config/db.js')).default
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit
    const orderId = req.query.orderId ? parseInt(req.query.orderId) : null
    const productId = req.query.productId ? parseInt(req.query.productId) : null
    
    let query = `
      SELECT oi.*, 
             o.order_number,
             o.user_id,
             u.name as user_name,
             u.email as user_email,
             p.name as product_name
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN users u ON o.user_id = u.id
      JOIN products p ON oi.product_id = p.id
    `
    const params = []
    
    const conditions = []
    if (orderId && !isNaN(orderId)) {
      conditions.push('oi.order_id = ?')
      params.push(orderId)
    }
    if (productId && !isNaN(productId)) {
      conditions.push('oi.product_id = ?')
      params.push(productId)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ' ORDER BY oi.created_at DESC'
    
    // Get total count
    const countQuery = query.replace(
      'SELECT oi.*, o.order_number, o.user_id, u.name as user_name, u.email as user_email, p.name as product_name',
      'SELECT COUNT(*) as total'
    )
    const [countResult] = await db.execute(countQuery, params)
    const total = countResult[0].total
    
    // Get paginated results
    query += ` LIMIT ${limit} OFFSET ${offset}`
    
    const [rows] = await db.execute(query, params)
    
    res.json({
      orderItems: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/order-items/:id
 * Get order item details
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/order-items/:id', async (req, res) => {
  try {
    const db = (await import('../config/db.js')).default
    const itemId = parseInt(req.params.id)
    
    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({ message: 'Invalid order item ID' })
    }
    
    const [rows] = await db.execute(
      `SELECT oi.*, 
              o.order_number,
              o.user_id,
              u.name as user_name,
              u.email as user_email,
              p.name as product_name,
              p.price as current_price
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN users u ON o.user_id = u.id
       JOIN products p ON oi.product_id = p.id
       WHERE oi.id = ?`,
      [itemId]
    )
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order item not found' })
    }
    
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// ORDERS CRUD OPERATIONS
// ============================================

/**
 * PUT /api/admin/orders/:id/status
 * Update order status (pending → processing → paid → delivered)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/orders/:id/status', validateOrderStatusTransition, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const { status } = req.body

    if (!status || !['pending', 'processing', 'paid', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: pending, processing, paid, or delivered' })
    }

    const db = (await import('../config/db.js')).default
    const order = await orderModel.getOrderById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Update order based on status
    if (status === 'paid') {
      await db.execute(
        'UPDATE orders SET is_paid = 1, paid_at = NOW() WHERE id = ?',
        [orderId]
      )
    } else if (status === 'delivered') {
      await db.execute(
        'UPDATE orders SET is_delivered = 1, delivered_at = NOW() WHERE id = ?',
        [orderId]
      )
    } else if (status === 'processing') {
      // Processing means paid but not delivered
      await db.execute(
        'UPDATE orders SET is_paid = 1, paid_at = COALESCE(paid_at, NOW()), is_delivered = 0 WHERE id = ?',
        [orderId]
      )
    } else if (status === 'pending') {
      await db.execute(
        'UPDATE orders SET is_paid = 0, is_delivered = 0, paid_at = NULL, delivered_at = NULL WHERE id = ?',
        [orderId]
      )
    }

    const updatedOrder = await orderModel.getOrderById(orderId)
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/orders/:id
 * Update order details (shipping address, payment info)
 */
router.put('/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const { shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body

    const order = await orderModel.getOrderById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const db = (await import('../config/db.js')).default
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // Update order fields
      const updateFields = []
      const updateValues = []

      if (paymentMethod) {
        updateFields.push('payment_method = ?')
        updateValues.push(paymentMethod)
      }
      if (taxPrice !== undefined) {
        updateFields.push('tax_price = ?')
        updateValues.push(taxPrice)
      }
      if (shippingPrice !== undefined) {
        updateFields.push('shipping_price = ?')
        updateValues.push(shippingPrice)
      }
      if (totalPrice !== undefined) {
        updateFields.push('total_price = ?')
        updateValues.push(totalPrice)
      }

      if (updateFields.length > 0) {
        updateValues.push(orderId)
        await connection.execute(
          `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        )
      }

      // Update shipping address if provided
      if (shippingAddress) {
        const { address, city, postalCode, country } = shippingAddress
        await connection.execute(
          `UPDATE shipping_addresses 
           SET address = ?, city = ?, postal_code = ?, country = ? 
           WHERE order_id = ?`,
          [address, city, postalCode, country, orderId]
        )
      }

      await connection.commit()
      const updatedOrder = await orderModel.getOrderById(orderId)
      res.json(updatedOrder)
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/orders/:id
 * Cancel/delete order (with validation)
 */
router.delete('/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const order = await orderModel.getOrderById(orderId)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if order can be deleted (not delivered)
    if (order.is_delivered) {
      return res.status(400).json({ message: 'Cannot delete a delivered order' })
    }

    const db = (await import('../config/db.js')).default
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      // Restore product stock if order was paid
      if (order.is_paid) {
        const [items] = await connection.execute(
          'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
          [orderId]
        )

        for (const item of items) {
          await connection.execute(
            'UPDATE products SET stock = stock + ? WHERE id = ?',
            [item.quantity, item.product_id]
          )
        }
      }

      // Delete order (cascade will delete order_items and shipping_addresses)
      await connection.execute('DELETE FROM orders WHERE id = ?', [orderId])

      await connection.commit()
      res.json({ message: 'Order deleted successfully' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/orders/bulk-update
 * Bulk update order statuses
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/orders/bulk-update', validateBulkOperation, async (req, res) => {
  try {
    const { orderIds, status } = req.body

    if (!status || !['pending', 'processing', 'paid', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const result = await bulkOperationsModel.bulkUpdateOrders(orderIds, { status })
    res.json({ 
      message: `${result.success} orders updated successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/orders/bulk-delete
 * Bulk delete orders
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/orders/bulk-delete', validateBulkOperation, async (req, res) => {
  try {
    const { orderIds } = req.body
    const result = await bulkOperationsModel.bulkDeleteOrders(orderIds)
    res.json({ 
      message: `${result.success} orders deleted successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// PRODUCTS CRUD OPERATIONS
// ============================================

/**
 * POST /api/admin/products/quick-create
 * Quick create product from dashboard
 */
router.post('/products/quick-create', async (req, res) => {
  try {
    const { name, description, price, child_category_id, stock } = req.body

    if (!name || !description || price === undefined || !child_category_id || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields: name, description, price, child_category_id, stock' })
    }

    const productId = await productModel.createProduct({
      name,
      description,
      price: parseFloat(price),
      child_category_id: parseInt(child_category_id),
      stock: parseInt(stock)
    })

    const product = await productModel.getProductById(productId)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/products/:id/stock
 * Update product stock inline
 */
router.put('/products/:id/stock', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { stock } = req.body

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative number' })
    }

    const updated = await productModel.updateProduct(productId, { stock: parseInt(stock) })
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/products/:id/status
 * Toggle product active/inactive (using stock > 0 as active)
 */
router.put('/products/:id/status', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { isActive } = req.body

    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // If setting to inactive, set stock to 0; if active, set to 1 if currently 0
    const newStock = isActive ? (product.stock === 0 ? 1 : product.stock) : 0
    const updated = await productModel.updateProduct(productId, { stock: newStock })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/products/:id/price
 * Update product price inline
 */
router.put('/products/:id/price', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const { price } = req.body

    if (price === undefined || price < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' })
    }

    const updated = await productModel.updateProduct(productId, { price: parseFloat(price) })
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/products/bulk-update
 * Bulk update products (stock, status, price)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/bulk-update', validateBulkOperation, async (req, res) => {
  try {
    const { productIds, updates } = req.body

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided' })
    }

    const result = await bulkOperationsModel.bulkUpdateProducts(productIds, updates)
    res.json({ 
      message: `${result.success} products updated successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/products/:id
 * Delete product (with validation for orders)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/products/:id', validateProductDeletion, async (req, res) => {
  try {
    const productId = parseInt(req.params.id)

    // Check if product exists in any orders
    const db = (await import('../config/db.js')).default
    const [orderItems] = await db.execute(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
      [productId]
    )

    if (orderItems[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete product that has been ordered. Consider setting stock to 0 instead.' 
      })
    }

    const deleted = await productModel.deleteProduct(productId)
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/products/bulk-delete
 * Bulk delete products
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/bulk-delete', validateBulkOperation, async (req, res) => {
  try {
    const { productIds } = req.body
    const result = await bulkOperationsModel.bulkDeleteProducts(productIds)
    res.json({ 
      message: `${result.success} products deleted successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/products/:id/out-of-stock
 * Mark product as out of stock
 */
router.put('/products/:id/out-of-stock', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const updated = await productModel.updateProduct(productId, { stock: 0 })
    
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/products/bulk-stock-update
 * Bulk update stock levels
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/bulk-stock-update', async (req, res) => {
  try {
    const { updates } = req.body // Array of { productId, stock }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'updates must be a non-empty array' })
    }

    const result = await bulkOperationsModel.bulkUpdateStock(updates)
    res.json({ 
      message: `${result.success} products updated successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// USERS CRUD OPERATIONS
// ============================================

/**
 * POST /api/admin/users/quick-create
 * Quick create user from dashboard
 */
router.post('/users/quick-create', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields: name, email, password' })
    }

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    // Check if user exists
    const existingUser = await userModel.findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userId = await userModel.createUser(name, email, hashedPassword)
    
    // Update role if not default
    if (role === 'admin') {
      await userModel.updateUserRole(userId, role)
    }

    const user = await userModel.findUserById(userId)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/users/:id/role
 * Update user role inline
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)
    const { role } = req.body

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' })
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
 * PUT /api/admin/users/:id/status
 * Activate/deactivate user (using a simple approach - can be enhanced with status field)
 * Note: This is a placeholder - actual implementation would require a status field in users table
 */
router.put('/users/:id/status', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)
    const { isActive } = req.body

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own status' })
    }

    // For now, we'll just return the user (status field would need to be added to schema)
    const user = await userModel.findUserById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // TODO: Add status field to users table and implement actual status toggle
    res.json({ ...user, isActive, message: 'Status update would be implemented with status field' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/users/bulk-update
 * Bulk update user roles/status
 */
router.post('/users/bulk-update', async (req, res) => {
  try {
    const { userIds, updates } = req.body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'userIds must be a non-empty array' })
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided' })
    }

    // Prevent self-update
    if (userIds.includes(req.user.id)) {
      return res.status(400).json({ message: 'Cannot update your own account in bulk' })
    }

    const db = (await import('../config/db.js')).default
    const placeholders = userIds.map(() => '?').join(',')

    const updateFields = []
    const updateValues = []

    if (updates.role && ['user', 'admin'].includes(updates.role)) {
      updateFields.push('role = ?')
      updateValues.push(updates.role)
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No valid updates provided' })
    }

    updateValues.push(...userIds)
    await db.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id IN (${placeholders})`,
      updateValues
    )

    res.json({ message: `${userIds.length} users updated successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// REVIEWS CRUD OPERATIONS
// ============================================

/**
 * GET /api/admin/reviews
 * Get all reviews with pagination, search, and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/reviews', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      productId: req.query.productId ? parseInt(req.query.productId) : null,
      userId: req.query.userId ? parseInt(req.query.userId) : null,
      rating: req.query.rating ? parseInt(req.query.rating) : null
    }
    const result = await reviewModel.getAllReviews(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/reviews/:id
 * Update review (rating, comment)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/reviews/:id', async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id)
    const { rating, comment } = req.body
    
    if (isNaN(reviewId) || reviewId <= 0) {
      return res.status(400).json({ message: 'Invalid review ID' })
    }
    
    const review = await reviewModel.getReviewById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }
    
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' })
    }
    
    const updateData = {}
    if (rating !== undefined) updateData.rating = rating
    if (comment !== undefined) updateData.comment = comment
    
    const updated = await reviewModel.updateReview(reviewId, updateData)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update review' })
    }
    
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/reviews/:id/approve
 * Approve review
 * Note: Requires is_approved field in reviews table (currently not in schema)
 */
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id)
    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // TODO: Uncomment when is_approved field is added to reviews table
    // const db = (await import('../config/db.js')).default
    // await db.execute(
    //   'UPDATE reviews SET is_approved = 1 WHERE id = ?',
    //   [reviewId]
    // )
    // const updatedReview = await reviewModel.getReviewById(reviewId)
    // res.json(updatedReview)

    // Placeholder until schema is updated
    res.json({ ...review, message: 'Review approved (requires is_approved field in reviews table)' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/reviews/:id/reject
 * Reject review
 * Note: Requires is_approved field in reviews table (currently not in schema)
 */
router.put('/reviews/:id/reject', async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id)
    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // TODO: Uncomment when is_approved field is added to reviews table
    // const db = (await import('../config/db.js')).default
    // await db.execute(
    //   'UPDATE reviews SET is_approved = 0 WHERE id = ?',
    //   [reviewId]
    // )
    // const updatedReview = await reviewModel.getReviewById(reviewId)
    // res.json(updatedReview)

    // Placeholder until schema is updated
    res.json({ ...review, message: 'Review rejected (requires is_approved field in reviews table)' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/reviews/:id
 * Delete review
 */
router.delete('/reviews/:id', async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id)
    const deleted = await reviewModel.deleteReview(reviewId)

    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/reviews/bulk-approve
 * Bulk approve reviews
 * Note: Requires is_approved field in reviews table (currently not in schema)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/reviews/bulk-approve', validateBulkOperation, async (req, res) => {
  try {
    const { reviewIds } = req.body
    const result = await bulkOperationsModel.bulkApproveReviews(reviewIds)
    res.json({ 
      message: result.message || `${result.success} reviews approved successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// COMMENTS CRUD OPERATIONS
// ============================================

/**
 * DELETE /api/admin/comments/:id
 * Delete comment
 */
router.delete('/comments/:id', async (req, res) => {
  try {
    const commentId = parseInt(req.params.id)
    const deleted = await commentModel.deleteComment(commentId, req.user.id, true)

    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/comments/bulk-approve
 * Bulk approve comments
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/comments/bulk-approve', validateBulkOperation, async (req, res) => {
  try {
    const { commentIds } = req.body
    const result = await bulkOperationsModel.bulkApproveComments(commentIds)
    res.json({ 
      message: `${result.success} comments approved successfully`,
      success: result.success,
      failed: result.failed
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ============================================
// VOUCHERS CRUD OPERATIONS
// ============================================

/**
 * POST /api/admin/vouchers/quick-create
 * Quick create voucher from dashboard
 */
router.post('/vouchers/quick-create', async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_purchase_amount = 0,
      max_discount_amount = null,
      start_date,
      end_date,
      usage_limit_per_user = 1,
      total_usage_limit = null,
      is_active = true
    } = req.body

    if (!code || !discount_type || !discount_value || !start_date || !end_date) {
      return res.status(400).json({ 
        message: 'Missing required fields: code, discount_type, discount_value, start_date, end_date' 
      })
    }

    if (!['percentage', 'fixed'].includes(discount_type)) {
      return res.status(400).json({ message: 'discount_type must be "percentage" or "fixed"' })
    }

    // Check if code exists
    const existing = await voucherModel.getVoucherByCode(code)
    if (existing) {
      return res.status(400).json({ message: 'Voucher code already exists' })
    }

    const voucherId = await voucherModel.createVoucher({
      code,
      description,
      discount_type,
      discount_value: parseFloat(discount_value),
      min_purchase_amount: parseFloat(min_purchase_amount),
      max_discount_amount: max_discount_amount ? parseFloat(max_discount_amount) : null,
      start_date,
      end_date,
      usage_limit_per_user: parseInt(usage_limit_per_user),
      total_usage_limit: total_usage_limit ? parseInt(total_usage_limit) : null,
      is_active
    })

    const voucher = await voucherModel.getVoucherById(voucherId)
    res.status(201).json(voucher)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/vouchers/:id/status
 * Activate/deactivate voucher
 */
router.put('/vouchers/:id/status', async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id)
    const { isActive } = req.body

    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive is required' })
    }

    const updated = await voucherModel.updateVoucher(voucherId, { is_active: isActive })
    if (!updated) {
      return res.status(404).json({ message: 'Voucher not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/vouchers/:id
 * Update voucher details inline
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/vouchers/:id', async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id)
    const updateData = req.body

    // Validate discount_type if provided
    if (updateData.discount_type && !['percentage', 'fixed'].includes(updateData.discount_type)) {
      return res.status(400).json({ message: 'discount_type must be "percentage" or "fixed"' })
    }

    const updated = await voucherModel.updateVoucher(voucherId, updateData)
    if (!updated) {
      return res.status(404).json({ message: 'Voucher not found' })
    }

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/vouchers/:id
 * Delete voucher
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/vouchers/:id', async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id)
    const deleted = await voucherModel.deleteVoucher(voucherId)
    
    if (!deleted) {
      return res.status(404).json({ message: 'Voucher not found' })
    }
    
    res.json({ message: 'Voucher deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/vouchers/bulk-update
 * Bulk update voucher status
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/vouchers/bulk-update', validateBulkOperation, async (req, res) => {
  try {
    const { voucherIds, isActive } = req.body

    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive is required' })
    }

    const db = (await import('../config/db.js')).default
    const placeholders = voucherIds.map(() => '?').join(',')
    
    await db.execute(
      `UPDATE vouchers SET is_active = ? WHERE id IN (${placeholders})`,
      [isActive, ...voucherIds]
    )

    res.json({ message: `${voucherIds.length} vouchers updated successfully` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

