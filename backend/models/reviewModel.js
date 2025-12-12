/**
 * Review Model
 * Handles all database operations related to product reviews
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Get reviews for a product
 * @param {number} productId - Product ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Reviews and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductReviews = async (productId, filters = {}) => {
  // Validate productId
  const id = parseInt(productId)
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid product ID')
  }
  
  const { page = 1, limit = 10 } = filters
  const validPage = parseInt(page) || 1
  const validLimit = parseInt(limit) || 10
  const offset = (validPage - 1) * validLimit
  
  // Ensure limit and offset are valid integers for MySQL
  const limitInt = Math.floor(Number(validLimit))
  const offsetInt = Math.floor(Number(offset))
  
  if (isNaN(limitInt) || limitInt < 1) {
    throw new Error('Invalid limit parameter')
  }
  if (isNaN(offsetInt) || offsetInt < 0) {
    throw new Error('Invalid offset parameter')
  }

  const [rows] = await db.execute(
    `SELECT r.*, 
            u.name as user_name,
            u.email as user_email
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC
     LIMIT ${limitInt} OFFSET ${offsetInt}`,
    [id]
  )

  const [countResult] = await db.execute(
    'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
    [id]
  )
  const total = countResult[0].total

  return {
    reviews: rows,
    pagination: {
      page: validPage,
      limit: validLimit,
      total,
      pages: Math.ceil(total / validLimit)
    }
  }
}

/**
 * Create a new review
 * @param {Object} reviewData - Review data
 * @returns {Promise<number>} - Created review ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const createReview = async (reviewData) => {
  const { product_id, user_id, rating, comment } = reviewData

  const [result] = await db.execute(
    'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
    [product_id, user_id, rating, comment]
  )
  return result.insertId
}

/**
 * Get review by ID
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object|null>} - Review object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getReviewById = async (reviewId) => {
  const [rows] = await db.execute(
    `SELECT r.*, 
            u.name as user_name,
            p.name as product_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN products p ON r.product_id = p.id
     WHERE r.id = ?`,
    [reviewId]
  )
  return rows[0] || null
}

/**
 * Update review
 * @param {number} reviewId - Review ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated review or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateReview = async (reviewId, updateData) => {
  const fields = []
  const values = []

  if (updateData.rating !== undefined) {
    fields.push('rating = ?')
    values.push(updateData.rating)
  }
  if (updateData.comment) {
    fields.push('comment = ?')
    values.push(updateData.comment)
  }

  if (fields.length === 0) return null

  values.push(reviewId)
  const [result] = await db.execute(
    `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null
  return getReviewById(reviewId)
}

/**
 * Delete review
 * @param {number} reviewId - Review ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteReview = async (reviewId) => {
  const [result] = await db.execute(
    'DELETE FROM reviews WHERE id = ?',
    [reviewId]
  )
  return result.affectedRows > 0
}

/**
 * Check if user has purchased a product (for review eligibility)
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} - True if user has purchased, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const hasUserPurchasedProduct = async (userId, productId) => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) as count
     FROM order_items oi
     JOIN orders o ON oi.order_id = o.id
     WHERE o.user_id = ? 
     AND oi.product_id = ? 
     AND o.is_paid = 1`,
    [userId, productId]
  )
  return rows[0].count > 0
}

/**
 * Check if user has already reviewed a product
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<boolean>} - True if reviewed, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const hasUserReviewedProduct = async (userId, productId) => {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM reviews WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  )
  return rows[0].count > 0
}

