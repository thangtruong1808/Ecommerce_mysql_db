/**
 * Like Model
 * Handles all database operations related to product likes
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Toggle like (insert if not exists, delete if exists)
 * @param {number} productId - Product ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Like status and count
 */
export const toggleLike = async (productId, userId) => {
  // Check if like exists
  const [existing] = await db.execute(
    'SELECT id FROM product_likes WHERE product_id = ? AND user_id = ?',
    [productId, userId]
  )
  
  if (existing.length > 0) {
    // Unlike - delete the like
    await db.execute(
      'DELETE FROM product_likes WHERE product_id = ? AND user_id = ?',
      [productId, userId]
    )
    
    const count = await getProductLikes(productId)
    return { liked: false, count }
  } else {
    // Like - insert new like
    await db.execute(
      'INSERT INTO product_likes (product_id, user_id) VALUES (?, ?)',
      [productId, userId]
    )
    
    const count = await getProductLikes(productId)
    return { liked: true, count }
  }
}

/**
 * Get like count for a product
 * @param {number} productId - Product ID
 * @returns {Promise<number>} - Like count
 */
export const getProductLikes = async (productId) => {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM product_likes WHERE product_id = ?',
    [productId]
  )
  return rows[0].count
}

/**
 * Check if user has liked a product
 * @param {number} productId - Product ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - True if liked, false otherwise
 */
export const hasUserLiked = async (productId, userId) => {
  if (!userId) return false
  
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count FROM product_likes WHERE product_id = ? AND user_id = ?',
    [productId, userId]
  )
  return rows[0].count > 0
}

/**
 * Get all products user has liked
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of liked products
 */
export const getUserLikedProducts = async (userId) => {
  const [rows] = await db.execute(
    `SELECT p.*, 
            pl.created_at as liked_at
     FROM product_likes pl
     JOIN products p ON pl.product_id = p.id
     WHERE pl.user_id = ?
     ORDER BY pl.created_at DESC`,
    [userId]
  )
  return rows
}

