/**
 * Product Model
 * Handles all database operations related to products
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Get all products with filters, pagination, and sorting
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Products and pagination info
 */
export const getAllProducts = async (filters = {}) => {
  const {
    page = 1,
    limit = 12,
    category = null,
    subcategory = null,
    minPrice = null,
    maxPrice = null,
    search = null,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = filters

  const offset = (page - 1) * limit
  const conditions = []
  const values = []

  // Build WHERE clause
  if (category) {
    conditions.push('c.id = ?')
    values.push(category)
  }
  if (subcategory) {
    conditions.push('p.subcategory_id = ?')
    values.push(subcategory)
  }
  if (minPrice !== null) {
    conditions.push('p.price >= ?')
    values.push(minPrice)
  }
  if (maxPrice !== null) {
    conditions.push('p.price <= ?')
    values.push(maxPrice)
  }
  if (search) {
    conditions.push('MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE)')
    values.push(search)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const orderBy = `ORDER BY p.${sortBy} ${sortOrder}`

  // Get products with subcategory and category names
  const [rows] = await db.execute(
    `SELECT p.*, 
            s.name as subcategory_name,
            s.id as subcategory_id,
            c.name as category_name,
            c.id as category_id
     FROM products p 
     JOIN subcategories s ON p.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     ${whereClause} 
     ${orderBy} 
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  )

  // Get total count
  const [countResult] = await db.execute(
    `SELECT COUNT(*) as total 
     FROM products p
     JOIN subcategories s ON p.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     ${whereClause}`,
    values
  )
  const total = countResult[0].total

  return {
    products: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get product by ID with images and videos
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} - Product object with related data or null
 */
export const getProductById = async (id) => {
  // Get product with subcategory and category
  const [productRows] = await db.execute(
    `SELECT p.*, 
            s.name as subcategory_name,
            s.id as subcategory_id,
            c.name as category_name,
            c.id as category_id
     FROM products p 
     JOIN subcategories s ON p.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     WHERE p.id = ?`,
    [id]
  )

  if (productRows.length === 0) return null

  const product = productRows[0]

  // Get product images
  const [imageRows] = await db.execute(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, created_at ASC',
    [id]
  )
  product.images = imageRows

  // Get product videos (optional)
  const [videoRows] = await db.execute(
    'SELECT * FROM product_videos WHERE product_id = ? ORDER BY is_primary DESC, created_at ASC',
    [id]
  )
  product.videos = videoRows

  return product
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<number>} - Inserted product ID
 */
export const createProduct = async (productData) => {
  const { name, description, price, subcategory_id, stock } = productData

  const [result] = await db.execute(
    'INSERT INTO products (name, description, price, subcategory_id, stock) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, subcategory_id, stock]
  )
  return result.insertId
}

/**
 * Update product
 * @param {number} id - Product ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated product or null
 */
export const updateProduct = async (id, updateData) => {
  const fields = []
  const values = []

  if (updateData.name) {
    fields.push('name = ?')
    values.push(updateData.name)
  }
  if (updateData.description) {
    fields.push('description = ?')
    values.push(updateData.description)
  }
  if (updateData.price !== undefined) {
    fields.push('price = ?')
    values.push(updateData.price)
  }
  if (updateData.subcategory_id) {
    fields.push('subcategory_id = ?')
    values.push(updateData.subcategory_id)
  }
  if (updateData.stock !== undefined) {
    fields.push('stock = ?')
    values.push(updateData.stock)
  }

  if (fields.length === 0) return null

  values.push(id)
  const [result] = await db.execute(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null
  return getProductById(id)
}

/**
 * Delete product
 * @param {number} id - Product ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteProduct = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM products WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

/**
 * Update product stock
 * @param {number} id - Product ID
 * @param {number} quantity - Quantity to subtract (negative) or add (positive)
 * @returns {Promise<boolean>} - True if updated, false otherwise
 */
export const updateProductStock = async (id, quantity) => {
  const [result] = await db.execute(
    'UPDATE products SET stock = stock + ? WHERE id = ?',
    [quantity, id]
  )
  return result.affectedRows > 0
}

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

