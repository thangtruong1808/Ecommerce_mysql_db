/**
 * Video Model
 * Handles product videos operations
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Add product video
 * @param {number} productId - Product ID
 * @param {Object} videoData - Video data
 * @returns {Promise<number>} - Inserted video ID
 * @author Thang Truong
 * @date 2025-12-12
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
 * Get product videos
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of video objects
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductVideos = async (productId) => {
  const id = parseInt(productId)
  if (isNaN(id) || id <= 0) {
    return []
  }
  const [rows] = await db.execute(
    'SELECT * FROM product_videos WHERE product_id = ? AND video_url IS NOT NULL ORDER BY is_primary DESC, created_at ASC',
    [id]
  )
  return rows
}

/**
 * Get product video by ID
 * @param {number} videoId - Video ID
 * @returns {Promise<Object|null>} - Video object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductVideoById = async (videoId) => {
  const id = parseInt(videoId)
  if (isNaN(id) || id <= 0) {
    return null
  }
  const [rows] = await db.execute(
    'SELECT * FROM product_videos WHERE id = ?',
    [id]
  )
  return rows.length > 0 ? rows[0] : null
}

/**
 * Update product video
 * @param {number} videoId - Video ID
 * @param {Object} data - Update data (title, description, thumbnail_url, duration, is_primary)
 * @returns {Promise<boolean>} - True if updated
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateProductVideo = async (videoId, data) => {
  const id = parseInt(videoId)
  if (isNaN(id) || id <= 0) {
    return false
  }
  
  const updates = []
  const values = []
  
  if (data.title !== undefined) {
    updates.push('title = ?')
    values.push(data.title || null)
  }
  if (data.description !== undefined) {
    updates.push('description = ?')
    values.push(data.description || null)
  }
  if (data.thumbnail_url !== undefined) {
    updates.push('thumbnail_url = ?')
    values.push(data.thumbnail_url || null)
  }
  if (data.duration !== undefined) {
    updates.push('duration = ?')
    values.push(data.duration || null)
  }
  if (data.is_primary !== undefined) {
    updates.push('is_primary = ?')
    values.push(data.is_primary)
  }
  
  if (updates.length === 0) {
    return false
  }
  
  values.push(id)
  const [result] = await db.execute(
    `UPDATE product_videos SET ${updates.join(', ')} WHERE id = ?`,
    values
  )
  
  return result.affectedRows > 0
}

/**
 * Delete product video
 * @param {number} videoId - Video ID
 * @returns {Promise<boolean>} - True if deleted
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteProductVideo = async (videoId) => {
  const id = parseInt(videoId)
  if (isNaN(id) || id <= 0) {
    return false
  }
  const [result] = await db.execute(
    'DELETE FROM product_videos WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

/**
 * Set primary video for product
 * @param {number} productId - Product ID
 * @param {number} videoId - Video ID to set as primary
 * @returns {Promise<boolean>} - True if updated
 * @author Thang Truong
 * @date 2025-12-12
 */
export const setPrimaryVideo = async (productId, videoId) => {
  const prodId = parseInt(productId)
  const vidId = parseInt(videoId)
  
  if (isNaN(prodId) || prodId <= 0 || isNaN(vidId) || vidId <= 0) {
    return false
  }
  
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    await connection.query(
      'UPDATE product_videos SET is_primary = FALSE WHERE product_id = ?',
      [prodId]
    )
    const [result] = await connection.query(
      'UPDATE product_videos SET is_primary = TRUE WHERE id = ? AND product_id = ?',
      [vidId, prodId]
    )
    await connection.commit()
    return result.affectedRows > 0
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Get all videos with pagination and filters
 * @param {Object} filters - Filter options (page, limit, search, productId)
 * @returns {Promise<Object>} - Videos with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllVideos = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  const search = filters.search || ''
  const productId = filters.productId ? parseInt(filters.productId) : null
  
  let query = `
    SELECT pv.*, p.name as product_name 
    FROM product_videos pv
    LEFT JOIN products p ON pv.product_id = p.id
    WHERE pv.video_url IS NOT NULL
  `
  const params = []
  
  if (productId && !isNaN(productId)) {
    query += ' AND pv.product_id = ?'
    params.push(productId)
  }
  
  if (search) {
    query += ' AND (p.name LIKE ? OR pv.title LIKE ? OR pv.video_url LIKE ?)'
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }
  
  query += ' ORDER BY pv.created_at DESC'
  
  // Get total count with same params (without LIMIT/OFFSET)
  const countQuery = query.replace('SELECT pv.*, p.name as product_name', 'SELECT COUNT(*) as total')
  const [countResult] = await db.execute(countQuery, params)
  const total = countResult[0].total
  
  // Add LIMIT/OFFSET directly (MySQL prepared statements have issues with LIMIT/OFFSET as parameters)
  // limit and offset are already validated as integers via parseInt
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute(query, params)
  
  return {
    videos: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}
