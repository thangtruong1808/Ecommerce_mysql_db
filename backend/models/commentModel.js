/**
 * Comment Model
 * Handles all database operations related to product comments
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Create a new comment
 * @param {number} productId - Product ID
 * @param {number} userId - User ID
 * @param {string} comment - Comment text
 * @returns {Promise<number>} - Created comment ID
 */
export const createComment = async (productId, userId, comment) => {
  const [result] = await db.execute(
    'INSERT INTO product_comments (product_id, user_id, comment, is_approved) VALUES (?, ?, ?, ?)',
    [productId, userId, comment, true]
  )
  return result.insertId
}

/**
 * Get comments for a product
 * @param {number} productId - Product ID
 * @param {boolean} includePending - Include pending comments (for admins)
 * @returns {Promise<Array>} - Array of comments
 */
export const getProductComments = async (productId, includePending = false) => {
  let query = `SELECT c.*, 
                      u.name as user_name,
                      u.email as user_email
               FROM product_comments c
               JOIN users u ON c.user_id = u.id
               WHERE c.product_id = ?`
  
  const params = [productId]
  
  if (!includePending) {
    query += ' AND c.is_approved = ?'
    params.push(true)
  }
  
  query += ' ORDER BY c.created_at DESC'
  
  const [rows] = await db.execute(query, params)
  return rows
}

/**
 * Get comment by ID
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object|null>} - Comment object or null
 */
export const getCommentById = async (commentId) => {
  const [rows] = await db.execute(
    `SELECT c.*, 
            u.name as user_name,
            p.name as product_name
     FROM product_comments c
     JOIN users u ON c.user_id = u.id
     JOIN products p ON c.product_id = p.id
     WHERE c.id = ?`,
    [commentId]
  )
  return rows[0] || null
}

/**
 * Update comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for authorization)
 * @param {string} comment - New comment text
 * @param {boolean} isAdmin - Whether user is admin
 * @returns {Promise<Object|null>} - Updated comment or null
 */
export const updateComment = async (commentId, userId, comment, isAdmin = false) => {
  // Check if user owns the comment or is admin
  const existingComment = await getCommentById(commentId)
  if (!existingComment) return null
  
  if (!isAdmin && existingComment.user_id !== userId) {
    throw new Error('Unauthorized to update this comment')
  }
  
  const [result] = await db.execute(
    'UPDATE product_comments SET comment = ? WHERE id = ?',
    [comment, commentId]
  )
  
  if (result.affectedRows === 0) return null
  return getCommentById(commentId)
}

/**
 * Delete comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for authorization)
 * @param {boolean} isAdmin - Whether user is admin
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteComment = async (commentId, userId, isAdmin = false) => {
  // Check if user owns the comment or is admin
  const existingComment = await getCommentById(commentId)
  if (!existingComment) return false
  
  if (!isAdmin && existingComment.user_id !== userId) {
    throw new Error('Unauthorized to delete this comment')
  }
  
  const [result] = await db.execute(
    'DELETE FROM product_comments WHERE id = ?',
    [commentId]
  )
  return result.affectedRows > 0
}

/**
 * Approve comment (admin only)
 * @param {number} commentId - Comment ID
 * @returns {Promise<boolean>} - True if approved, false otherwise
 */
export const approveComment = async (commentId) => {
  const [result] = await db.execute(
    'UPDATE product_comments SET is_approved = ? WHERE id = ?',
    [true, commentId]
  )
  return result.affectedRows > 0
}

/**
 * Reject comment (admin only)
 * @param {number} commentId - Comment ID
 * @returns {Promise<boolean>} - True if rejected, false otherwise
 */
export const rejectComment = async (commentId) => {
  const [result] = await db.execute(
    'UPDATE product_comments SET is_approved = ? WHERE id = ?',
    [false, commentId]
  )
  return result.affectedRows > 0
}

/**
 * Get pending comments (for admin moderation)
 * @returns {Promise<Array>} - Array of pending comments
 */
export const getPendingComments = async () => {
  const [rows] = await db.execute(
    `SELECT c.*, 
            u.name as user_name,
            u.email as user_email,
            p.name as product_name
     FROM product_comments c
     JOIN users u ON c.user_id = u.id
     JOIN products p ON c.product_id = p.id
     WHERE c.is_approved = ?
     ORDER BY c.created_at DESC`,
    [false]
  )
  return rows
}

