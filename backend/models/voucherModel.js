/**
 * Voucher Model
 * Handles all database operations related to vouchers
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Create a new voucher
 * @param {Object} voucherData - Voucher data
 * @returns {Promise<number>} - Created voucher ID
 */
export const createVoucher = async (voucherData) => {
  const {
    code,
    description,
    discount_type,
    discount_value,
    min_purchase_amount = 0.00,
    max_discount_amount = null,
    start_date,
    end_date,
    usage_limit_per_user = 1,
    total_usage_limit = null,
    is_active = true
  } = voucherData
  
  const [result] = await db.execute(
    `INSERT INTO vouchers (
      code, description, discount_type, discount_value,
      min_purchase_amount, max_discount_amount,
      start_date, end_date,
      usage_limit_per_user, total_usage_limit,
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      code,
      description,
      discount_type,
      discount_value,
      min_purchase_amount,
      max_discount_amount,
      start_date,
      end_date,
      usage_limit_per_user,
      total_usage_limit,
      is_active
    ]
  )
  return result.insertId
}

/**
 * Get voucher by code
 * @param {string} code - Voucher code
 * @returns {Promise<Object|null>} - Voucher object or null
 */
export const getVoucherByCode = async (code) => {
  const [rows] = await db.execute(
    'SELECT * FROM vouchers WHERE code = ?',
    [code]
  )
  return rows[0] || null
}

/**
 * Get all active vouchers
 * @returns {Promise<Array>} - Array of active vouchers
 */
export const getActiveVouchers = async () => {
  const now = new Date()
  const [rows] = await db.execute(
    `SELECT * FROM vouchers 
     WHERE is_active = ? 
     AND start_date <= ? 
     AND end_date >= ?
     ORDER BY created_at DESC`,
    [true, now, now]
  )
  return rows
}

/**
 * Validate voucher for use
 * @param {string} code - Voucher code
 * @param {number} userId - User ID
 * @param {number} orderTotal - Order total amount
 * @returns {Promise<Object>} - Validation result with voucher data or error
 */
export const validateVoucher = async (code, userId, orderTotal) => {
  const voucher = await getVoucherByCode(code)
  
  if (!voucher) {
    return { valid: false, error: 'Voucher code not found' }
  }
  
  if (!voucher.is_active) {
    return { valid: false, error: 'Voucher is not active' }
  }
  
  const now = new Date()
  if (now < new Date(voucher.start_date)) {
    return { valid: false, error: 'Voucher has not started yet' }
  }
  
  if (now > new Date(voucher.end_date)) {
    return { valid: false, error: 'Voucher has expired' }
  }
  
  if (orderTotal < voucher.min_purchase_amount) {
    return { 
      valid: false, 
      error: `Minimum purchase amount of $${voucher.min_purchase_amount} required` 
    }
  }
  
  if (voucher.total_usage_limit !== null && voucher.current_usage_count >= voucher.total_usage_limit) {
    return { valid: false, error: 'Voucher usage limit reached' }
  }
  
  const userUsageCount = await getVoucherUsageCount(voucher.id, userId)
  if (userUsageCount >= voucher.usage_limit_per_user) {
    return { valid: false, error: 'You have reached the usage limit for this voucher' }
  }
  
  return { valid: true, voucher }
}

/**
 * Record voucher usage
 * @param {number} voucherId - Voucher ID
 * @param {number} userId - User ID
 * @param {number} orderId - Order ID
 * @returns {Promise<number>} - Usage record ID
 */
export const useVoucher = async (voucherId, userId, orderId) => {
  // Record usage
  const [result] = await db.execute(
    'INSERT INTO voucher_usages (voucher_id, user_id, order_id) VALUES (?, ?, ?)',
    [voucherId, userId, orderId]
  )
  
  // Increment usage count
  await db.execute(
    'UPDATE vouchers SET current_usage_count = current_usage_count + 1 WHERE id = ?',
    [voucherId]
  )
  
  return result.insertId
}

/**
 * Get voucher usage count for a user
 * @param {number} voucherId - Voucher ID
 * @param {number} userId - User ID
 * @returns {Promise<number>} - Usage count
 */
export const getVoucherUsageCount = async (voucherId, userId) => {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM voucher_usages WHERE voucher_id = ? AND user_id = ?',
    [voucherId, userId]
  )
  return rows[0].count
}

/**
 * Get all vouchers (admin)
 * @returns {Promise<Array>} - Array of all vouchers
 */
/**
 * Get all vouchers with pagination
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Vouchers and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllVouchers = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  
  // Ensure limit and offset are valid integers
  const limitInt = Number.isInteger(limit) ? limit : parseInt(limit, 10)
  const offsetInt = Number.isInteger(offset) ? offset : parseInt(offset, 10)
  
  if (isNaN(limitInt) || limitInt < 1) {
    throw new Error('Invalid limit parameter')
  }
  if (isNaN(offsetInt) || offsetInt < 0) {
    throw new Error('Invalid offset parameter')
  }
  
  // Get total count
  const [countResult] = await db.execute('SELECT COUNT(*) as total FROM vouchers')
  const total = countResult[0]?.total || 0
  
  // Get paginated results
  const [rows] = await db.execute(
    `SELECT * FROM vouchers ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`
  )
  
  return {
    vouchers: rows,
    pagination: {
      page,
      limit: limitInt,
      total,
      pages: Math.ceil(total / limitInt)
    }
  }
}

/**
 * Get voucher by ID
 * @param {number} voucherId - Voucher ID
 * @returns {Promise<Object|null>} - Voucher object or null
 */
export const getVoucherById = async (voucherId) => {
  const [rows] = await db.execute(
    'SELECT * FROM vouchers WHERE id = ?',
    [voucherId]
  )
  return rows[0] || null
}

/**
 * Update voucher
 * @param {number} voucherId - Voucher ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated voucher or null
 */
export const updateVoucher = async (voucherId, updateData) => {
  const fields = []
  const values = []
  
  const allowedFields = [
    'code', 'description', 'discount_type', 'discount_value',
    'min_purchase_amount', 'max_discount_amount',
    'start_date', 'end_date',
    'usage_limit_per_user', 'total_usage_limit', 'is_active'
  ]
  
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      fields.push(`${field} = ?`)
      values.push(updateData[field])
    }
  }
  
  if (fields.length === 0) return null
  
  values.push(voucherId)
  const [result] = await db.execute(
    `UPDATE vouchers SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
  
  if (result.affectedRows === 0) return null
  return getVoucherById(voucherId)
}

/**
 * Delete voucher
 * @param {number} voucherId - Voucher ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteVoucher = async (voucherId) => {
  const [result] = await db.execute(
    'DELETE FROM vouchers WHERE id = ?',
    [voucherId]
  )
  return result.affectedRows > 0
}

