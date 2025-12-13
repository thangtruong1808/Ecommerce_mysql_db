/**
 * Order Model
 * Handles all database operations related to orders
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Create a new order with items and shipping address
 * @param {Object} orderData - Order data
 * @returns {Promise<number>} - Created order ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const createOrder = async (orderData) => {
  const connection = await db.getConnection()
  
  try {
    await connection.beginTransaction()

    const {
      user_id,
      orderItems,
      shippingAddress,
      paymentMethod = 'Mock Payment',
      taxPrice = 0,
      shippingPrice = 0,
      totalPrice
    } = orderData

    // Create order
    const voucherId = orderData.voucher_id || null
    const voucherDiscount = orderData.voucher_discount || 0
    
    // Generate order number
    const [orderNumResult] = await connection.execute('SELECT generate_order_number() as order_number')
    const orderNumber = orderNumResult[0].order_number
    
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
       (order_number, user_id, voucher_id, voucher_discount, payment_method, tax_price, shipping_price, total_price) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, user_id, voucherId, voucherDiscount, paymentMethod, taxPrice, shippingPrice, totalPrice]
    )
    const orderId = orderResult.insertId

    // Create order items
    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO order_items 
         (order_id, product_id, name, image_url, price, quantity) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.name, item.image_url, item.price, item.quantity]
      )

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      )
    }

    // Create shipping address
    await connection.execute(
      `INSERT INTO shipping_addresses 
       (order_id, address, city, postal_code, country) 
       VALUES (?, ?, ?, ?, ?)`,
      [orderId, shippingAddress.address, shippingAddress.city, shippingAddress.postalCode, shippingAddress.country]
    )

    await connection.commit()
    return orderId
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Get order by ID with full details
 * @param {number} orderId - Order ID
 * @param {number} userId - User ID for authorization
 * @returns {Promise<Object|null>} - Order object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getOrderById = async (orderId, userId = null) => {
  let query = `
    SELECT o.*, 
           u.name as user_name, 
           u.email as user_email,
           sa.address, sa.city, sa.postal_code, sa.country
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
    WHERE o.id = ?
  `
  const params = [orderId]

  if (userId) {
    query += ' AND o.user_id = ?'
    params.push(userId)
  }

  const [orderRows] = await db.execute(query, params)
  if (orderRows.length === 0) return null

  const order = orderRows[0]
  if (!order.order_number) { const date = new Date(order.created_at); const datePart = date.toISOString().slice(0, 10).replace(/-/g, ''); order.order_number = `ORD-${datePart}-${String(order.id).padStart(5, '0')}` }
  // Get order items
  const [itemRows] = await db.execute(
    'SELECT * FROM order_items WHERE order_id = ?',
    [orderId]
  )
  order.items = itemRows

  return order
}

/**
 * Get all orders for a user
 * @param {number} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Orders and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getUserOrders = async (userId, filters = {}) => {
  const { page = 1, limit = 10 } = filters
  const offset = (page - 1) * limit

  // Validate and convert to integers to avoid MySQL prepared statement issues
  const limitInt = parseInt(limit, 10)
  const offsetInt = parseInt(offset, 10)
  if (isNaN(limitInt) || isNaN(offsetInt) || limitInt < 1 || offsetInt < 0) {
    throw new Error('Invalid pagination parameters')
  }

  const [rows] = await db.execute(`SELECT o.*, COUNT(oi.id) as item_count FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ? GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`, [userId])
  for (const order of rows) { if (!order.order_number) { const date = new Date(order.created_at); const datePart = date.toISOString().slice(0, 10).replace(/-/g, ''); order.order_number = `ORD-${datePart}-${String(order.id).padStart(5, '0')}` } }
  const [countResult] = await db.execute('SELECT COUNT(*) as total FROM orders WHERE user_id = ?', [userId])
  return { orders: rows, pagination: { page, limit, total: countResult[0].total, pages: Math.ceil(countResult[0].total / limit) } }
}

/**
 * Get all orders (admin only)
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Orders and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllOrders = async (filters = {}) => {
  const { page = 1, limit = 20, status = null } = filters
  const offset = (page - 1) * limit
  
  // Validate and convert to integers to avoid MySQL prepared statement issues
  const limitInt = parseInt(limit, 10)
  const offsetInt = parseInt(offset, 10)
  if (isNaN(limitInt) || isNaN(offsetInt) || limitInt < 1 || offsetInt < 0) {
    throw new Error('Invalid pagination parameters')
  }
  
  let whereClause = ''
  const params = []

  if (status === 'paid') whereClause = 'WHERE o.is_paid = 1'
  else if (status === 'delivered') whereClause = 'WHERE o.is_delivered = 1'
  else if (status === 'pending') whereClause = 'WHERE o.is_paid = 0'

  const [rows] = await db.execute(`SELECT o.*, u.name as user_name, u.email as user_email, COUNT(oi.id) as item_count FROM orders o JOIN users u ON o.user_id = u.id LEFT JOIN order_items oi ON o.id = oi.order_id ${whereClause} GROUP BY o.id ORDER BY o.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`, params)
  for (const order of rows) { if (!order.order_number) { const date = new Date(order.created_at); const datePart = date.toISOString().slice(0, 10).replace(/-/g, ''); order.order_number = `ORD-${datePart}-${String(order.id).padStart(5, '0')}` } }
  const [countResult] = await db.execute(`SELECT COUNT(*) as total FROM orders o ${whereClause}`, params)
  return { orders: rows, pagination: { page, limit, total: countResult[0].total, pages: Math.ceil(countResult[0].total / limit) } }
}

/**
 * Update order payment information
 * @param {number} orderId - Order ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} - True if updated, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateOrderPayment = async (orderId, paymentData) => {
  const { payment_result_id, payment_status, payment_update_time, payment_email } = paymentData
  const [result] = await db.execute(`UPDATE orders SET is_paid = 1, paid_at = NOW(), payment_result_id = ?, payment_status = ?, payment_update_time = ?, payment_email = ? WHERE id = ?`, [payment_result_id, payment_status, payment_update_time, payment_email, orderId])
  return result.affectedRows > 0
}

/**
 * Update order delivery status
 * @param {number} orderId - Order ID
 * @returns {Promise<boolean>} - True if updated, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateOrderDelivery = async (orderId) => {
  const [result] = await db.execute('UPDATE orders SET is_delivered = 1, delivered_at = NOW() WHERE id = ?', [orderId])
  return result.affectedRows > 0
}

