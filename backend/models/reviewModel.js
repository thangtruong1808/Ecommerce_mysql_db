/**
 * Review Model
 * Handles all database operations related to product reviews
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Get reviews for a product
 * @param {number} productId - Product ID
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Reviews and pagination info
 */
export const getProductReviews = async (productId, filters = {}) => {
  const { page = 1, limit = 10 } = filters
  const offset = (page - 1) * limit

  const [rows] = await db.execute(
    `SELECT r.*, 
            u.name as user_name,
            u.email as user_email
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.product_id = ?
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [productId, limit, offset]
  )

  const [countResult] = await db.execute(
    'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
    [productId]
  )
  const total = countResult[0].total

  return {
    reviews: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Create a new review
 * @param {Object} reviewData - Review data
 * @returns {Promise<number>} - Created review ID
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
 */
export const hasUserReviewedProduct = async (userId, productId) => {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM reviews WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  )
  return rows[0].count > 0
}

