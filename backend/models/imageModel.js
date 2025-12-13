/**
 * Image Model
 * Handles product images operations
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Add product image
 * @param {number} productId - Product ID
 * @param {string} imageUrl - Image URL
 * @param {boolean} isPrimary - Is primary image
 * @returns {Promise<number>} - Inserted image ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const addProductImage = async (productId, imageUrl, isPrimary = false) => {
  const [result] = await db.execute(
    'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
    [productId, imageUrl, isPrimary]
  )
  return result.insertId
}

/**
 * Get product images
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} - Array of image objects
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductImages = async (productId) => {
  const id = parseInt(productId)
  if (isNaN(id) || id <= 0) {
    return []
  }
  const [rows] = await db.execute(
    'SELECT * FROM product_images WHERE product_id = ? AND image_url IS NOT NULL ORDER BY is_primary DESC, created_at ASC',
    [id]
  )
  return rows
}

/**
 * Get images for multiple products
 * @param {Array<number>} productIds - Array of product IDs
 * @returns {Promise<Object>} - Map of product_id to images array
 * @author Thang Truong
 * @date 2025-12-12
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
  
  const imagesMap = {}
  imageRows.forEach(img => {
    if (!imagesMap[img.product_id]) {
      imagesMap[img.product_id] = []
    }
    imagesMap[img.product_id].push(img)
  })
  
  return imagesMap
}

/**
 * Get product image by ID
 * @param {number} imageId - Image ID
 * @returns {Promise<Object|null>} - Image object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductImageById = async (imageId) => {
  const id = parseInt(imageId)
  if (isNaN(id) || id <= 0) {
    return null
  }
  const [rows] = await db.execute(
    'SELECT * FROM product_images WHERE id = ?',
    [id]
  )
  return rows.length > 0 ? rows[0] : null
}

/**
 * Update product image
 * @param {number} imageId - Image ID
 * @param {Object} data - Update data (is_primary, etc.)
 * @returns {Promise<boolean>} - True if updated
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateProductImage = async (imageId, data) => {
  const id = parseInt(imageId)
  if (isNaN(id) || id <= 0) {
    return false
  }
  
  const updates = []
  const values = []
  
  if (data.is_primary !== undefined) {
    updates.push('is_primary = ?')
    values.push(data.is_primary)
  }
  
  if (updates.length === 0) {
    return false
  }
  
  values.push(id)
  const [result] = await db.execute(
    `UPDATE product_images SET ${updates.join(', ')} WHERE id = ?`,
    values
  )
  
  return result.affectedRows > 0
}

/**
 * Delete product image
 * @param {number} imageId - Image ID
 * @returns {Promise<boolean>} - True if deleted
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteProductImage = async (imageId) => {
  const id = parseInt(imageId)
  if (isNaN(id) || id <= 0) {
    return false
  }
  const [result] = await db.execute(
    'DELETE FROM product_images WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

/**
 * Set primary image for product
 * @param {number} productId - Product ID
 * @param {number} imageId - Image ID to set as primary
 * @returns {Promise<boolean>} - True if updated
 * @author Thang Truong
 * @date 2025-12-12
 */
export const setPrimaryImage = async (productId, imageId) => {
  const prodId = parseInt(productId)
  const imgId = parseInt(imageId)
  
  if (isNaN(prodId) || prodId <= 0 || isNaN(imgId) || imgId <= 0) {
    return false
  }
  
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    await connection.query(
      'UPDATE product_images SET is_primary = FALSE WHERE product_id = ?',
      [prodId]
    )
    const [result] = await connection.query(
      'UPDATE product_images SET is_primary = TRUE WHERE id = ? AND product_id = ?',
      [imgId, prodId]
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
 * Get all images with pagination and filters
 * @param {Object} filters - Filter options (page, limit, search, productId)
 * @returns {Promise<Object>} - Images with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllImages = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  const search = filters.search || ''
  const productId = filters.productId ? parseInt(filters.productId) : null
  
  let query = `
    SELECT pi.*, p.name as product_name 
    FROM product_images pi
    LEFT JOIN products p ON pi.product_id = p.id
    WHERE pi.image_url IS NOT NULL
  `
  const params = []
  
  if (productId && !isNaN(productId)) {
    query += ' AND pi.product_id = ?'
    params.push(productId)
  }
  
  if (search) {
    query += ' AND (p.name LIKE ? OR pi.image_url LIKE ?)'
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern)
  }
  
  query += ' ORDER BY pi.created_at DESC'
  
  // Get total count with same params (without LIMIT/OFFSET)
  const countQuery = query.replace('SELECT pi.*, p.name as product_name', 'SELECT COUNT(*) as total')
  const [countResult] = await db.execute(countQuery, params)
  const total = countResult[0].total
  
  // Add LIMIT/OFFSET directly (MySQL prepared statements have issues with LIMIT/OFFSET as parameters)
  // limit and offset are already validated as integers via parseInt
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute(query, params)
  
  return {
    images: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}
