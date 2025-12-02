/**
 * Invoice Model
 * Handles all database operations related to invoices
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Generate unique invoice number using database function
 * @returns {Promise<string>} - Generated invoice number
 */
export const generateInvoiceNumber = async () => {
  const [rows] = await db.execute('SELECT generate_invoice_number() as invoice_number')
  return rows[0].invoice_number
}

/**
 * Create invoice for an order
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<number>} - Created invoice ID
 */
export const createInvoice = async (invoiceData) => {
  const {
    order_id,
    user_id,
    subtotal,
    tax_amount,
    shipping_amount,
    total_amount,
    payment_method,
    payment_status,
    billing_address,
    shipping_address
  } = invoiceData

  const invoice_number = await generateInvoiceNumber()

  const [result] = await db.execute(
    `INSERT INTO invoices 
     (invoice_number, order_id, user_id, subtotal, tax_amount, shipping_amount, 
      total_amount, payment_method, payment_status, billing_address, shipping_address) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      invoice_number,
      order_id,
      user_id,
      subtotal,
      tax_amount,
      shipping_amount,
      total_amount,
      payment_method,
      payment_status,
      JSON.stringify(billing_address),
      JSON.stringify(shipping_address)
    ]
  )
  return result.insertId
}

/**
 * Get invoice by ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} userId - User ID (for authorization)
 * @returns {Promise<Object|null>} - Invoice object or null
 */
export const getInvoiceById = async (invoiceId, userId = null) => {
  let query = `
    SELECT i.*, 
           o.id as order_id,
           u.name as user_name,
           u.email as user_email
    FROM invoices i
    JOIN orders o ON i.order_id = o.id
    JOIN users u ON i.user_id = u.id
    WHERE i.id = ?
  `
  const params = [invoiceId]

  if (userId) {
    query += ' AND i.user_id = ?'
    params.push(userId)
  }

  const [rows] = await db.execute(query, params)
  if (rows.length === 0) return null

  const invoice = rows[0]
  
  // Parse JSON addresses
  try {
    invoice.billing_address = JSON.parse(invoice.billing_address)
    invoice.shipping_address = JSON.parse(invoice.shipping_address)
  } catch (e) {
    // If parsing fails, keep as string
  }

  return invoice
}

/**
 * Get invoice by order ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} - Invoice object or null
 */
export const getInvoiceByOrderId = async (orderId) => {
  const [rows] = await db.execute(
    'SELECT * FROM invoices WHERE order_id = ?',
    [orderId]
  )
  
  if (rows.length === 0) return null

  const invoice = rows[0]
  
  // Parse JSON addresses
  try {
    invoice.billing_address = JSON.parse(invoice.billing_address)
    invoice.shipping_address = JSON.parse(invoice.shipping_address)
  } catch (e) {
    // If parsing fails, keep as string
  }

  return invoice
}

/**
 * Get all invoices for a user
 * @param {number} userId - User ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Invoices and pagination info
 */
export const getUserInvoices = async (userId, filters = {}) => {
  const { page = 1, limit = 10 } = filters
  const offset = (page - 1) * limit

  const [rows] = await db.execute(
    `SELECT i.*, o.id as order_id
     FROM invoices i
     JOIN orders o ON i.order_id = o.id
     WHERE i.user_id = ?
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  )

  const [countResult] = await db.execute(
    'SELECT COUNT(*) as total FROM invoices WHERE user_id = ?',
    [userId]
  )
  const total = countResult[0].total

  return {
    invoices: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update invoice email sent status
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<boolean>} - True if updated, false otherwise
 */
export const markInvoiceEmailSent = async (invoiceId) => {
  const [result] = await db.execute(
    'UPDATE invoices SET email_sent = 1, email_sent_at = NOW() WHERE id = ?',
    [invoiceId]
  )
  return result.affectedRows > 0
}

/**
 * Update invoice PDF path
 * @param {number} invoiceId - Invoice ID
 * @param {string} pdfPath - Path to PDF file
 * @returns {Promise<boolean>} - True if updated, false otherwise
 */
export const updateInvoicePdfPath = async (invoiceId, pdfPath) => {
  const [result] = await db.execute(
    'UPDATE invoices SET pdf_path = ? WHERE id = ?',
    [pdfPath, invoiceId]
  )
  return result.affectedRows > 0
}

/**
 * Get all invoices (admin only)
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Invoices and pagination info
 */
export const getAllInvoices = async (filters = {}) => {
  const { page = 1, limit = 20 } = filters
  const offset = (page - 1) * limit

  const [rows] = await db.execute(
    `SELECT i.*, 
            u.name as user_name,
            u.email as user_email,
            o.id as order_id
     FROM invoices i
     JOIN users u ON i.user_id = u.id
     JOIN orders o ON i.order_id = o.id
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  )

  const [countResult] = await db.execute('SELECT COUNT(*) as total FROM invoices')
  const total = countResult[0].total

  return {
    invoices: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

