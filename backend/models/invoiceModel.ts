import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type * as Rows from "../types/domain.js";
/**
 * Invoice Model
 * Handles all database operations related to invoices
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Generate unique invoice number using database function
 * @returns {Promise<string>} - Generated invoice number
 * @author Thang Truong
 * @date 2025-12-12
 */
export const generateInvoiceNumber = async () => {
  const [rows] = await db.execute<RowDataPacket[]>('SELECT generate_invoice_number() as invoice_number')
  return rows[0].invoice_number
}

/**
 * Create invoice for an order
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<number>} - Created invoice ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const createInvoice = async (invoiceData: Rows.FieldMap) => {
  const { order_id, user_id, subtotal, tax_amount, shipping_amount, total_amount, payment_method, payment_status, billing_address, shipping_address } = invoiceData
  const invoice_number = await generateInvoiceNumber()
  const [result] = await db.execute<ResultSetHeader>(`INSERT INTO invoices (invoice_number, order_id, user_id, subtotal, tax_amount, shipping_amount, total_amount, payment_method, payment_status, billing_address, shipping_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [invoice_number, order_id, user_id, subtotal, tax_amount, shipping_amount, total_amount, payment_method, payment_status, JSON.stringify(billing_address), JSON.stringify(shipping_address)])
  return result.insertId
}

/**
 * Get invoice by ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} userId - User ID (for authorization)
 * @returns {Promise<Object|null>} - Invoice object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getInvoiceById = async (invoiceId: number, userId: number | null = null) => {
  let query = `
    SELECT i.*, 
           o.id as order_id,
           o.order_number,
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

  const [rows] = await db.execute<RowDataPacket[]>(query, params)
  if (rows.length === 0) return null

  const invoice = rows[0]
  
  // Parse JSON addresses
  try {
    invoice.billing_address = JSON.parse(invoice.billing_address)
    invoice.shipping_address = JSON.parse(invoice.shipping_address)
  } catch (e) {
    // If parsing fails, keep as string
  }

  // Get order items for invoice
  const [itemRows] = await db.execute<Rows.OrderItemRow[]>('SELECT * FROM order_items WHERE order_id = ?', [invoice.order_id])
  invoice.items = itemRows

  return invoice
}

/**
 * Get invoice by order ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object|null>} - Invoice object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getInvoiceByOrderId = async (orderId: number) => {
  const [rows] = await db.execute<Rows.InvoiceRow[]>(
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
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getUserInvoices = async (userId: number, filters: Rows.ListQuery = {}) => {
  const { page = 1, limit = 10 } = filters
  const offset = (Number(page) - 1) * Number(limit)

  // Validate and convert to integers to avoid MySQL prepared statement issues
  const limitInt = parseInt(String(limit), 10)
  const offsetInt = parseInt(String(offset), 10)
  if (isNaN(limitInt) || isNaN(offsetInt) || limitInt < 1 || offsetInt < 0) {
    throw new Error('Invalid pagination parameters')
  }

  const [rows] = await db.execute<Rows.InvoiceRow[]>(`SELECT i.*, o.id as order_id, o.order_number FROM invoices i JOIN orders o ON i.order_id = o.id WHERE i.user_id = ? ORDER BY i.created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`, [userId])
  const [countResult] = await db.execute<Rows.CountRow[]>('SELECT COUNT(*) as total FROM invoices WHERE user_id = ?', [userId])
  return { invoices: rows, pagination: { page, limit, total: countResult[0].total, pages: Math.ceil(countResult[0].total / Number(limit)) } }
}

/**
 * Update invoice email sent status
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<boolean>} - True if updated, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const markInvoiceEmailSent = async (invoiceId: number) => {
  const [result] = await db.execute<ResultSetHeader>(
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
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateInvoicePdfPath = async (invoiceId: number, pdfPath: string) => {
  const [result] = await db.execute<ResultSetHeader>(
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
/**
 * Get all invoices (admin only)
 * @param {Object} filters - Filter options (page, limit, search, paymentStatus)
 * @returns {Promise<Object>} - Invoices and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllInvoices = async (filters: Rows.ListQuery = {}) => {
  const page = parseInt(String(filters.page)) || 1
  const limit = parseInt(String(filters.limit)) || 20
  const search = filters.search || ''
  const paymentStatus = filters.paymentStatus || null
  const offset = (Number(page) - 1) * Number(limit)

  // Validate and convert to integers to avoid MySQL prepared statement issues
  const limitInt = parseInt(String(limit), 10)
  const offsetInt = parseInt(String(offset), 10)
  if (isNaN(limitInt) || isNaN(offsetInt) || limitInt < 1 || offsetInt < 0) {
    throw new Error('Invalid pagination parameters')
  }

  let query = `
    SELECT i.*, 
           u.name as user_name, 
           u.email as user_email, 
           o.id as order_id, 
           o.order_number
    FROM invoices i
    JOIN users u ON i.user_id = u.id
    JOIN orders o ON i.order_id = o.id
  `
  const params: any[] = []
  
  const conditions: string[] = []
  if (paymentStatus) {
    conditions.push('i.payment_status = ?')
    params.push(paymentStatus)
  }
  if (search) {
    conditions.push('(i.invoice_number LIKE ? OR o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)')
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern, searchPattern)
  }
  
  // Get total count (before adding ORDER BY and LIMIT)
  let countQuery = `
    SELECT COUNT(*) as total
    FROM invoices i
    JOIN users u ON i.user_id = u.id
    JOIN orders o ON i.order_id = o.id
  `
  if (conditions.length > 0) {
    countQuery += ' WHERE ' + conditions.join(' AND ')
  }
  const [countResult] = await db.execute<Rows.CountRow[]>(countQuery, params)
  const total = Number(countResult[0]?.total) || 0
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  
  // Sorting support
  const sortBy = filters.sortBy || 'created_at'
  const sortOrder = filters.sortOrder || 'desc'
  const allowedSortColumns = ['id', 'invoice_number', 'order_id', 'user_id', 'subtotal', 'tax_amount', 'shipping_amount', 'total_amount', 'payment_method', 'payment_status', 'email_sent', 'user_name', 'order_number', 'created_at', 'email_sent_at']
  const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'
  const validSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'
  
  // Map sort column to actual table column
  let sortColumn = `i.${validSortBy}`
  if (validSortBy === 'user_name') sortColumn = 'u.name'
  else if (validSortBy === 'order_number') sortColumn = 'o.order_number'
  
  query += ` ORDER BY ${sortColumn} ${validSortOrder}`
  
  // Get paginated results
  query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`
  
  const [rows] = await db.execute<RowDataPacket[]>(query, params)
  return { 
    invoices: rows, 
    pagination: { 
      page, 
      limit, 
      total: Number(total) || 0, 
      pages: Math.ceil((Number(total) || 0) / limit) 
    } 
  }
}

/**
 * Update invoice
 * @param {number} invoiceId - Invoice ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated invoice or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateInvoice = async (invoiceId: number, updateData: Rows.FieldMap) => {
  const fields: string[] = []
  const values: any[] = []
  
  if (updateData.payment_status !== undefined) {
    fields.push('payment_status = ?')
    values.push(updateData.payment_status)
  }
  if (updateData.email_sent !== undefined) {
    fields.push('email_sent = ?')
    values.push(updateData.email_sent)
    if (updateData.email_sent) {
      fields.push('email_sent_at = NOW()')
    } else {
      fields.push('email_sent_at = NULL')
    }
  }
  
  if (fields.length === 0) return null
  
  values.push(invoiceId)
  const [result] = await db.execute<ResultSetHeader>(
    `UPDATE invoices SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
  
  if (result.affectedRows === 0) return null
  return getInvoiceById(invoiceId, null)
}

/**
 * Delete invoice
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteInvoice = async (invoiceId: number) => {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM invoices WHERE id = ?',
    [invoiceId]
  )
  return result.affectedRows > 0
}

