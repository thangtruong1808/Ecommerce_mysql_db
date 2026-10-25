import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type * as Rows from "../types/domain.js";
/**
 * Analytics Model
 * Handles all analytics and statistics queries for the admin dashboard
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Get date range for a given period or custom dates
 * @param {string} period - Time period (today, week, month, year, all)
 * @param {string|Date} customStartDate - Custom start date (optional)
 * @param {string|Date} customEndDate - Custom end date (optional)
 * @returns {Object} Object with startDate and endDate
 */
const getDateRange = (
  period: string,
  customStartDate: string | Date | null = null,
  customEndDate: string | Date | null = null
) => {
  // If custom dates are provided, use them
  if (customStartDate || customEndDate) {
    return {
      startDate: customStartDate ? new Date(customStartDate) : null,
      endDate: customEndDate ? new Date(customEndDate) : new Date()
    }
  }

  // Otherwise, use period-based calculation
  const now = new Date()
  let startDate: Date | null = null
  let endDate = new Date()

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      const dayOfWeek = now.getDay()
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) // Monday
      startDate = new Date(now.getFullYear(), now.getMonth(), diff)
      startDate.setHours(0, 0, 0, 0)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    case 'all':
    default:
      startDate = null
      break
  }

  return { startDate, endDate }
}

/**
 * Get sales overview with growth percentage
 * @param {string} period - Time period
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Object>} Sales overview data
 */
export const getSalesOverview = async (period: any = 'month', startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    // Build WHERE clause for current period
    let whereClause = 'WHERE o.is_paid = 1'
    let params: any[] = []
    
    if (start) {
      whereClause += ' AND o.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      whereClause += ' AND o.created_at <= ?'
      params.push(end)
    }

    // Get current period sales
    const [currentResult] = await db.execute<Rows.CountRow[]>(
      `SELECT 
        SUM(o.total_price) as total_sales,
        COUNT(*) as order_count
       FROM orders o
       ${whereClause}`,
      params
    )

    const currentSales = parseFloat(currentResult[0].total_sales || 0)
    const currentOrders = parseInt(String(currentResult[0].order_count || 0))

    // Calculate previous period for comparison
    let previousStartDate = null
    let previousEndDate = start
    let growth = 0

    if (start) {
      const periodDays = Math.floor((Number(end) - Number(start)) / (1000 * 60 * 60 * 24))
      previousEndDate = new Date(start)
      previousStartDate = new Date(previousEndDate.getTime() - periodDays * 24 * 60 * 60 * 1000)

      const [previousResult] = await db.execute<Rows.OrderRow[]>(
        `SELECT SUM(o.total_price) as total_sales
         FROM orders o
         WHERE o.is_paid = 1 AND o.created_at >= ? AND o.created_at < ?`,
        [previousStartDate, previousEndDate]
      )

      const previousSales = parseFloat(previousResult[0].total_sales || 0)
      if (previousSales > 0) {
        growth = ((currentSales - previousSales) / previousSales) * 100
      } else if (currentSales > 0) {
        growth = 100
      }
    }

    return {
      totalSales: currentSales,
      orderCount: currentOrders,
      growth: parseFloat(growth.toFixed(2))
    }
  } catch (error: unknown) {
    throw new Error(`Failed to get sales overview: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get sales trend data for charts
 * @param {string} period - Time period
 * @param {string} groupBy - Group by (day, week, month)
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Array>} Sales trend data
 */
export const getSalesTrend = async (period: any = 'month', groupBy: any = 'day', startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    let dateFormat = 'DATE(o.created_at)'
    let groupByClause = 'DATE(o.created_at)'
    
    if (groupBy === 'week') {
      dateFormat = 'DATE_FORMAT(o.created_at, "%Y-%u")'
      groupByClause = 'YEARWEEK(o.created_at)'
    } else if (groupBy === 'month') {
      dateFormat = 'DATE_FORMAT(o.created_at, "%Y-%m")'
      groupByClause = 'DATE_FORMAT(o.created_at, "%Y-%m")'
    }

    let whereClause = 'WHERE o.is_paid = 1'
    let params: any[] = []
    
    if (start) {
      whereClause += ' AND o.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      whereClause += ' AND o.created_at <= ?'
      params.push(end)
    }

    const [results] = await db.execute<Rows.CountRow[]>(
      `SELECT 
        ${dateFormat} as date,
        SUM(o.total_price) as revenue,
        COUNT(*) as order_count
       FROM orders o
       ${whereClause}
       GROUP BY ${groupByClause}
       ORDER BY date ASC`,
      params
    )

    return results.map(row => ({
      date: row.date,
      revenue: parseFloat(row.revenue || 0),
      orders: parseInt(String(row.order_count || 0))
    }))
  } catch (error: unknown) {
    throw new Error(`Failed to get sales trend: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get order statistics by status
 * @param {string} period - Time period
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Object>} Order statistics
 */
export const getOrderStatistics = async (period: any = 'month', startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    let whereClause = ''
    let params: any[] = []
    
    if (start) {
      whereClause = 'WHERE o.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      if (whereClause) {
        whereClause += ' AND o.created_at <= ?'
      } else {
        whereClause = 'WHERE o.created_at <= ?'
      }
      params.push(end)
    }

    // Get orders by status
    const [statusResults] = await db.execute<Rows.OrderRow[]>(
      `SELECT 
        CASE 
          WHEN o.is_delivered = 1 THEN 'delivered'
          WHEN o.is_paid = 1 THEN 'paid'
          ELSE 'pending'
        END as status,
        COUNT(*) as count
       FROM orders o
       ${whereClause}
       GROUP BY status`,
      params
    )

    const statusBreakdown = statusResults.map(row => ({
      status: row.status,
      count: parseInt(String(row.count || 0))
    }))

    // Get total orders
    const [totalResult] = await db.execute<Rows.CountRow[]>(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      params
    )

    // Get previous period comparison
    let growth = 0
    if (start) {
      const periodDays = Math.floor((Number(end) - Number(start)) / (1000 * 60 * 60 * 24))
      const previousEndDate = new Date(start)
      const previousStartDate = new Date(previousEndDate.getTime() - periodDays * 24 * 60 * 60 * 1000)

      const [previousResult] = await db.execute<Rows.CountRow[]>(
        `SELECT COUNT(*) as total 
         FROM orders o
         WHERE o.created_at >= ? AND o.created_at < ?`,
        [previousStartDate, previousEndDate]
      )

      const previousTotal = parseInt(String(previousResult[0].total || 0))
      const currentTotal = parseInt(String(totalResult[0].total || 0))
      
      if (previousTotal > 0) {
        growth = ((currentTotal - previousTotal) / previousTotal) * 100
      } else if (currentTotal > 0) {
        growth = 100
      }
    }

    return {
      total: parseInt(String(totalResult[0].total || 0)),
      statusBreakdown,
      growth: parseFloat(growth.toFixed(2))
    }
  } catch (error: unknown) {
    throw new Error(`Failed to get order statistics: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get customer insights and growth
 * @param {string} period - Time period
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Object>} Customer insights
 */
export const getCustomerInsights = async (period: any = 'month', startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    let whereClause = ''
    let params: any[] = []
    
    if (start) {
      whereClause = 'WHERE u.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      if (whereClause) {
        whereClause += ' AND u.created_at <= ?'
      } else {
        whereClause = 'WHERE u.created_at <= ?'
      }
      params.push(end)
    }

    // Get new customers in period
    const [newCustomersResult] = await db.execute<Rows.CountRow[]>(
      `SELECT COUNT(*) as count FROM users u ${whereClause}`,
      params
    )

    const newCustomers = parseInt(String(newCustomersResult[0].count || 0))

    // Get customer growth data
    const [growthData] = await db.execute<Rows.CountRow[]>(
      `SELECT 
        DATE(u.created_at) as date,
        COUNT(*) as new_customers
       FROM users u
       ${whereClause}
       GROUP BY DATE(u.created_at)
       ORDER BY date ASC`,
      params
    )

    // Get total customers
    const [totalResult] = await db.execute<Rows.CountRow[]>('SELECT COUNT(*) as total FROM users')
    const totalCustomers = parseInt(String(totalResult[0].total || 0))

    // Calculate growth
    let growth = 0
    if (start) {
      const periodDays = Math.floor((Number(end) - Number(start)) / (1000 * 60 * 60 * 24))
      const previousEndDate = new Date(start)
      const previousStartDate = new Date(previousEndDate.getTime() - periodDays * 24 * 60 * 60 * 1000)

      const [previousResult] = await db.execute<Rows.CountRow[]>(
        `SELECT COUNT(*) as count 
         FROM users u
         WHERE u.created_at >= ? AND u.created_at < ?`,
        [previousStartDate, previousEndDate]
      )

      const previousCount = parseInt(String(previousResult[0].count || 0))
      
      if (previousCount > 0) {
        growth = ((newCustomers - previousCount) / previousCount) * 100
      } else if (newCustomers > 0) {
        growth = 100
      }
    }

    return {
      totalCustomers,
      newCustomers,
      growth: parseFloat(growth.toFixed(2)),
      growthData: growthData.map(row => {
        let dateStr = row.date
        if (dateStr instanceof Date) {
          dateStr = dateStr.toISOString().split('T')[0]
        } else if (typeof dateStr === 'string') {
          // Already a string, use as is
          dateStr = dateStr.split('T')[0] // Remove time if present
        }
        return {
          date: dateStr,
          newCustomers: parseInt(String(row.new_customers || 0))
        }
      })
    }
  } catch (error: unknown) {
    throw new Error(`Failed to get customer insights: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get inventory overview
 * @returns {Promise<Object>} Inventory data
 */
export const getInventoryOverview = async () => {
  try {
    // Get low stock products
    const [lowStock] = await db.execute<Rows.ProductRow[]>(
      `SELECT id, name, stock, price
       FROM products
       WHERE stock < 10
       ORDER BY stock ASC
       LIMIT 10`
    )

    // Get total products
    const [totalResult] = await db.execute<Rows.CountRow[]>('SELECT COUNT(*) as total FROM products')
    
    // Get stock value
    const [stockValueResult] = await db.execute<Rows.ProductRow[]>(
      'SELECT SUM(price * stock) as total_value FROM products'
    )

    // Get best sellers (by units sold)
    const [bestSellers] = await db.execute<Rows.ProductRow[]>(
      `SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) as units_sold
       FROM products p
       JOIN order_items oi ON p.id = oi.product_id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.is_paid = 1
       GROUP BY p.id, p.name
       ORDER BY units_sold DESC
       LIMIT 10`
    )

    return {
      totalProducts: parseInt(String(totalResult[0].total || 0)),
      stockValue: parseFloat(String(stockValueResult[0].total_value || 0)),
      lowStockProducts: lowStock.map(p => ({
        id: p.id,
        name: p.name,
        stock: parseInt(String(p.stock || 0)),
        price: parseFloat(String(p.price || 0))
      })),
      bestSellers: bestSellers.map(p => ({
        id: p.id,
        name: p.name,
        unitsSold: parseInt(String(p.units_sold || 0))
      }))
    }
  } catch (error: unknown) {
    throw new Error(`Failed to get inventory overview: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get revenue by category
 * @param {string} period - Time period
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Array>} Revenue by category data
 */
export const getRevenueByCategory = async (period: any = 'month', startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    let whereClause = 'WHERE o.is_paid = 1'
    let params: any[] = []
    
    if (start) {
      whereClause += ' AND o.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      whereClause += ' AND o.created_at <= ?'
      params.push(end)
    }

    const [results] = await db.execute<Rows.CategoryRow[]>(
      `SELECT 
        c.id,
        c.name as category_name,
        SUM(oi.price * oi.quantity) as revenue,
        COUNT(DISTINCT o.id) as order_count
       FROM categories c
       JOIN subcategories sc ON c.id = sc.category_id
       JOIN child_categories cc ON sc.id = cc.subcategory_id
       JOIN products p ON cc.id = p.child_category_id
       JOIN order_items oi ON p.id = oi.product_id
       JOIN orders o ON oi.order_id = o.id
       ${whereClause}
       GROUP BY c.id, c.name
       ORDER BY revenue DESC`,
      params
    )

    const totalRevenue = results.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0)

    return results.map(row => ({
      id: row.id,
      name: row.category_name,
      revenue: parseFloat(row.revenue || 0),
      orderCount: parseInt(String(row.order_count || 0)),
      percentage: totalRevenue > 0 ? (parseFloat(row.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
    }))
  } catch (error: unknown) {
    throw new Error(`Failed to get revenue by category: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get top products by revenue
 * @param {string} period - Time period
 * @param {number} limit - Number of products to return
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Array>} Top products
 */
export const getTopProducts = async (period: any = 'month', limit: any = 10, startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    let whereClause = 'WHERE o.is_paid = 1'
    let params: any[] = []
    
    if (start) {
      whereClause += ' AND o.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      whereClause += ' AND o.created_at <= ?'
      params.push(end)
    }

    // Validate limit as integer for safe interpolation
    const limitInt = parseInt(String(limit), 10) || 10
    if (isNaN(limitInt) || limitInt < 1) {
      throw new Error('Invalid limit parameter')
    }

    const [results] = await db.execute<Rows.ProductRow[]>(
      `SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) as units_sold,
        SUM(oi.price * oi.quantity) as revenue
       FROM products p
       JOIN order_items oi ON p.id = oi.product_id
       JOIN orders o ON oi.order_id = o.id
       ${whereClause}
       GROUP BY p.id, p.name
       ORDER BY revenue DESC
       LIMIT ${limitInt}`,
      params
    )

    return results.map(row => ({
      id: row.id,
      name: row.name,
      unitsSold: parseInt(String(row.units_sold || 0)),
      revenue: parseFloat(row.revenue || 0)
    }))
  } catch (error: unknown) {
    throw new Error(`Failed to get top products: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get recent activity (orders, reviews, comments, registrations)
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Recent activities
 */
export const getRecentActivity = async (limit: any = 15) => {
  try {
    // Validate limit as integer
    const limitInt = parseInt(String(limit), 10) || 15
    if (isNaN(limitInt) || limitInt < 1) {
      throw new Error('Invalid limit parameter')
    }

    const ordersLimit = Math.floor(limitInt * 0.4) || 1
    const registrationsLimit = Math.floor(limitInt * 0.2) || 1
    const reviewsLimit = Math.floor(limitInt * 0.2) || 1
    const commentsLimit = Math.floor(limitInt * 0.2) || 1

    // Get recent orders
    const [orders] = await db.execute<Rows.OrderRow[]>(
      `SELECT 
        o.id,
        o.order_number,
        o.total_price,
        o.created_at,
        u.name as user_name,
        'order' as type
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ${ordersLimit}`
    )

    // Get recent user registrations
    const [registrations] = await db.execute<Rows.UserRow[]>(
      `SELECT 
        id,
        name,
        email,
        created_at,
        'registration' as type
       FROM users
       ORDER BY created_at DESC
       LIMIT ${registrationsLimit}`
    )

    // Get recent reviews (if reviews table exists)
    let reviews: Rows.ReviewRow[] = []
    try {
      const [reviewResults] = await db.execute<Rows.ReviewRow[]>(
        `SELECT 
          r.id,
          r.rating,
          r.comment,
          r.created_at,
          u.name as user_name,
          p.name as product_name,
          'review' as type
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         JOIN products p ON r.product_id = p.id
         ORDER BY r.created_at DESC
         LIMIT ${reviewsLimit}`
      )
      reviews = reviewResults
    } catch (error: unknown) {
      // Reviews table might not exist, skip
    }

    // Get recent comments (if product_comments table exists)
    let comments: Rows.CommentRow[] = []
    try {
      const [commentResults] = await db.execute<Rows.CommentRow[]>(
        `SELECT 
          c.id,
          c.comment as content,
          c.created_at,
          u.name as user_name,
          p.name as product_name,
          'comment' as type
         FROM product_comments c
         JOIN users u ON c.user_id = u.id
         JOIN products p ON c.product_id = p.id
         ORDER BY c.created_at DESC
         LIMIT ${commentsLimit}`
      )
      comments = commentResults
    } catch (error: unknown) {
      // Comments table might not exist, skip
    }

    // Combine and sort all activities
    const allActivities = [
      ...orders.map(o => ({
        id: o.id,
        type: 'order',
        title: `Order ${o.order_number || `#${o.id}`}`,
        description: `${o.user_name} placed an order`,
        amount: parseFloat(String(o.total_price || 0)),
        user: o.user_name,
        createdAt: o.created_at
      })),
      ...registrations.map(r => ({
        id: r.id,
        type: 'registration',
        title: 'New User Registration',
        description: `${r.name} (${r.email}) registered`,
        user: r.name,
        createdAt: r.created_at
      })),
      ...reviews.map(r => ({
        id: r.id,
        type: 'review',
        title: `Review for ${r.product_name}`,
        description: `${r.user_name} left a ${r.rating}-star review`,
        user: r.user_name,
        product: r.product_name,
        createdAt: r.created_at
      })),
      ...comments.map(c => ({
        id: c.id,
        type: 'comment',
        title: `Comment on ${c.product_name}`,
        description: `${c.user_name} commented`,
        user: c.user_name,
        product: c.product_name,
        createdAt: c.created_at
      }))
    ]

    // Sort by created_at descending and limit
    allActivities.sort(
      (a, b) =>
        new Date(b.createdAt as string | Date).getTime() -
        new Date(a.createdAt as string | Date).getTime()
    )
    return allActivities.slice(0, limit)
  } catch (error: unknown) {
    throw new Error(`Failed to get recent activity: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Get performance metrics (conversion rate, AOV, etc.)
 * @param {string} period - Time period
 * @param {string|Date} startDate - Custom start date (optional)
 * @param {string|Date} endDate - Custom end date (optional)
 * @returns {Promise<Object>} Performance metrics
 */
export const getPerformanceMetrics = async (period: any = 'month', startDate: any = null, endDate: any = null) => {
  try {
    const { startDate: start, endDate: end } = getDateRange(period, startDate, endDate)

    let whereClause = ''
    let params: any[] = []
    
    if (start) {
      whereClause = 'WHERE o.created_at >= ?'
      params.push(start)
    }
    
    if (end) {
      if (whereClause) {
        whereClause += ' AND o.created_at <= ?'
      } else {
        whereClause = 'WHERE o.created_at <= ?'
      }
      params.push(end)
    }

    // Get paid orders
    const paidWhereClause = whereClause ? `${whereClause} AND o.is_paid = 1` : 'WHERE o.is_paid = 1'
    const [paidOrdersResult] = await db.execute<Rows.CountRow[]>(
      `SELECT 
        COUNT(*) as count,
        SUM(o.total_price) as total_revenue,
        AVG(o.total_price) as avg_order_value
       FROM orders o
       ${paidWhereClause}`,
      params
    )

    // Get total orders
    const [totalOrdersResult] = await db.execute<Rows.CountRow[]>(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      params
    )

    // Get total customers who made orders
    const [customersResult] = await db.execute<Rows.CountRow[]>(
      `SELECT COUNT(DISTINCT o.user_id) as count
       FROM orders o
       ${paidWhereClause}`,
      params
    )

    // Get total visitors (approximate - using unique users who created orders)
    const [visitorsResult] = await db.execute<Rows.CountRow[]>(
      `SELECT COUNT(DISTINCT o.user_id) as count
       FROM orders o
       ${whereClause}`,
      params
    )

    const paidOrders = parseInt(String(paidOrdersResult[0].count || 0))
    const totalOrders = parseInt(String(totalOrdersResult[0].total || 0))
    const totalRevenue = parseFloat(paidOrdersResult[0].total_revenue || 0)
    const aov = parseFloat(paidOrdersResult[0].avg_order_value || 0)
    const customers = parseInt(String(customersResult[0].count || 0))
    const visitors = parseInt(String(visitorsResult[0].count || 0))

    // Calculate conversion rate (paid orders / total orders)
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0

    // Calculate revenue per customer
    const revenuePerCustomer = customers > 0 ? totalRevenue / customers : 0

    // Calculate previous period metrics for growth
    let revenueGrowth = 0
    let ordersGrowth = 0
    let customersGrowth = 0
    let aovGrowth = 0
    let conversionGrowth = 0

    if (start) {
      const periodDays = Math.floor((Number(end) - Number(start)) / (1000 * 60 * 60 * 24))
      const previousEndDate = new Date(start)
      const previousStartDate = new Date(previousEndDate.getTime() - periodDays * 24 * 60 * 60 * 1000)

      const [prevPaidResult] = await db.execute<Rows.CountRow[]>(
        `SELECT 
          COUNT(*) as count,
          SUM(o.total_price) as total_revenue,
          AVG(o.total_price) as avg_order_value
         FROM orders o
         WHERE o.is_paid = 1 AND o.created_at >= ? AND o.created_at < ?`,
        [previousStartDate, previousEndDate]
      )

      const [prevTotalResult] = await db.execute<Rows.CountRow[]>(
        `SELECT COUNT(*) as total FROM orders o
         WHERE o.created_at >= ? AND o.created_at < ?`,
        [previousStartDate, previousEndDate]
      )

      const [prevCustomersResult] = await db.execute<Rows.CountRow[]>(
        `SELECT COUNT(DISTINCT o.user_id) as count
         FROM orders o
         WHERE o.is_paid = 1 AND o.created_at >= ? AND o.created_at < ?`,
        [previousStartDate, previousEndDate]
      )

      const prevRevenue = parseFloat(prevPaidResult[0].total_revenue || 0)
      const prevOrders = parseInt(String(prevPaidResult[0].count || 0))
      const prevTotalOrders = parseInt(String(prevTotalResult[0].total || 0))
      const prevCustomers = parseInt(String(prevCustomersResult[0].count || 0))
      const prevAov = parseFloat(prevPaidResult[0].avg_order_value || 0)
      const prevConversion = prevTotalOrders > 0 ? (prevOrders / prevTotalOrders) * 100 : 0

      if (prevRevenue > 0) revenueGrowth = ((totalRevenue - prevRevenue) / prevRevenue) * 100
      else if (totalRevenue > 0) revenueGrowth = 100

      if (prevOrders > 0) ordersGrowth = ((paidOrders - prevOrders) / prevOrders) * 100
      else if (paidOrders > 0) ordersGrowth = 100

      if (prevCustomers > 0) customersGrowth = ((customers - prevCustomers) / prevCustomers) * 100
      else if (customers > 0) customersGrowth = 100

      if (prevAov > 0) aovGrowth = ((aov - prevAov) / prevAov) * 100
      else if (aov > 0) aovGrowth = 100

      if (prevConversion > 0) conversionGrowth = ((conversionRate - prevConversion) / prevConversion) * 100
      else if (conversionRate > 0) conversionGrowth = 100
    }

    return {
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      aov: parseFloat(aov.toFixed(2)),
      revenuePerCustomer: parseFloat(revenuePerCustomer.toFixed(2)),
      revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
      ordersGrowth: parseFloat(ordersGrowth.toFixed(2)),
      customersGrowth: parseFloat(customersGrowth.toFixed(2)),
      aovGrowth: parseFloat(aovGrowth.toFixed(2)),
      conversionGrowth: parseFloat(conversionGrowth.toFixed(2)),
      newCustomers: customers
    }
  } catch (error: unknown) {
    throw new Error(`Failed to get performance metrics: ${error instanceof Error ? error.message : String(error)}`)
  }
}
