/**
 * Product Media Model
 * Handles product images and videos operations
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Add product image
 * @param {number} productId - Product ID
 * @param {string} imageUrl - Image URL
 * @param {boolean} isPrimary - Is primary image
 * @returns {Promise<number>} - Inserted image ID
 */
export const addProductImage = async (productId, imageUrl, isPrimary = false) => {
  const [result] = await db.execute(
    'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
    [productId, imageUrl, isPrimary]
  )
  return result.insertId
}

/**
 * Add product video
 * @param {number} productId - Product ID
 * @param {Object} videoData - Video data
 * @returns {Promise<number>} - Inserted video ID
 */
export const addProductVideo = async (productId, videoData) => {
  const { video_url, title, description, thumbnail_url, duration, is_primary } = videoData

  const [result] = await db.execute(
    'INSERT INTO product_videos (product_id, video_url, title, description, thumbnail_url, duration, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [productId, video_url, title || null, description || null, thumbnail_url || null, duration || null, is_primary || false]
  )
  return result.insertId
}

/**
 * Get product images
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of image objects
 */
export const getProductImages = async (productId) => {
  const [rows] = await db.execute(
    'SELECT * FROM product_images WHERE product_id = ? AND image_url IS NOT NULL ORDER BY is_primary DESC, created_at ASC',
    [productId]
  )
  return rows
}

/**
 * Get product videos
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of video objects
 */
export const getProductVideos = async (productId) => {
  const [rows] = await db.execute(
    'SELECT * FROM product_videos WHERE product_id = ? AND video_url IS NOT NULL ORDER BY is_primary DESC, created_at ASC',
    [productId]
  )
  return rows
}

/**
 * Get images for multiple products
 * @param {Array<number>} productIds - Array of product IDs
 * @returns {Promise<Object>} - Map of product_id to images array
 */
export const getProductsImages = async (productIds) => {
  if (productIds.length === 0) return {}
  
  const placeholders = productIds.map(() => '?').join(',')
  const [imageRows] = await db.execute(
    `SELECT product_id, id, image_url, is_primary 
     FROM product_images 
     WHERE product_id IN (${placeholders}) 
     AND image_url IS NOT NULL
     ORDER BY is_primary DESC, created_at ASC`,
    productIds
  )
  
  // Group images by product_id
  const imagesMap = {}
  imageRows.forEach(img => {
    if (!imagesMap[img.product_id]) {
      imagesMap[img.product_id] = []
    }
    imagesMap[img.product_id].push(img)
  })
  
  return imagesMap
}

