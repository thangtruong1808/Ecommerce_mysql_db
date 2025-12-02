/**
 * Product Model
 * Handles all database operations related to products
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'
import * as productMediaModel from './productMediaModel.js'

/**
 * Calculate discounted price based on discount type and value
 * @param {number} price - Original price
 * @param {string} discountType - 'percentage' or 'fixed'
 * @param {number} discountValue - Discount value
 * @returns {number} - Discounted price
 */
const calculateDiscountedPrice = (price, discountType, discountValue) => {
  if (!discountType || !discountValue) return price
  
  if (discountType === 'percentage') {
    return price * (1 - discountValue / 100)
  } else {
    return Math.max(0, price - discountValue)
  }
}

/**
 * Check if discount is currently active
 * @param {string} discountStartDate - Start date
 * @param {string} discountEndDate - End date
 * @returns {boolean} - True if discount is active
 */
const isDiscountActive = (discountStartDate, discountEndDate) => {
  if (!discountStartDate || !discountEndDate) return false
  
  const now = new Date()
  const start = new Date(discountStartDate)
  const end = new Date(discountEndDate)
  
  return now >= start && now <= end
}

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
    childCategory = null,
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
    conditions.push('s.id = ?')
    values.push(subcategory)
  }
  if (childCategory) {
    conditions.push('p.child_category_id = ?')
    values.push(childCategory)
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

  // Get products with full 3-level hierarchy
  const [rows] = await db.execute(
    `SELECT p.*, 
            cc.name as child_category_name,
            cc.id as child_category_id,
            s.name as subcategory_name,
            s.id as subcategory_id,
            c.name as category_name,
            c.id as category_id
     FROM products p 
     JOIN child_categories cc ON p.child_category_id = cc.id
     JOIN subcategories s ON cc.subcategory_id = s.id
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
     JOIN child_categories cc ON p.child_category_id = cc.id
     JOIN subcategories s ON cc.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     ${whereClause}`,
    values
  )
  const total = countResult[0].total

  // Get images for each product
  const productIds = rows.map(p => p.id)
  const imagesMap = await productMediaModel.getProductsImages(productIds)

  // Attach images and calculate discounted prices
  const productsWithImages = rows.map(product => {
    const isActive = isDiscountActive(product.discount_start_date, product.discount_end_date)
    const discountedPrice = isActive && product.is_on_clearance
      ? calculateDiscountedPrice(product.price, product.discount_type, product.discount_value)
      : product.price
    
    return {
      ...product,
      images: imagesMap[product.id] || [],
      discounted_price: discountedPrice,
      has_discount: isActive && product.is_on_clearance
    }
  })

  return {
    products: productsWithImages,
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
  // Get product with full 3-level hierarchy
  const [productRows] = await db.execute(
    `SELECT p.*, 
            cc.name as child_category_name,
            cc.id as child_category_id,
            s.name as subcategory_name,
            s.id as subcategory_id,
            c.name as category_name,
            c.id as category_id
     FROM products p 
     JOIN child_categories cc ON p.child_category_id = cc.id
     JOIN subcategories s ON cc.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     WHERE p.id = ?`,
    [id]
  )

  if (productRows.length === 0) return null

  const product = productRows[0]

  // Get product images and videos
  product.images = await productMediaModel.getProductImages(id)
  product.videos = await productMediaModel.getProductVideos(id)

  // Calculate discounted price
  const isActive = isDiscountActive(product.discount_start_date, product.discount_end_date)
  product.discounted_price = isActive && product.is_on_clearance
    ? calculateDiscountedPrice(product.price, product.discount_type, product.discount_value)
    : product.price
  product.has_discount = isActive && product.is_on_clearance

  return product
}

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<number>} - Inserted product ID
 */
export const createProduct = async (productData) => {
  const { 
    name, 
    description, 
    price, 
    child_category_id, 
    stock,
    discount_type = null,
    discount_value = null,
    discount_start_date = null,
    discount_end_date = null,
    is_on_clearance = false
  } = productData

  const [result] = await db.execute(
    `INSERT INTO products (
      name, description, price, child_category_id, stock,
      discount_type, discount_value, discount_start_date, discount_end_date, is_on_clearance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name, 
      description, 
      price, 
      child_category_id, 
      stock,
      discount_type,
      discount_value,
      discount_start_date,
      discount_end_date,
      is_on_clearance
    ]
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
  if (updateData.child_category_id) {
    fields.push('child_category_id = ?')
    values.push(updateData.child_category_id)
  }
  if (updateData.stock !== undefined) {
    fields.push('stock = ?')
    values.push(updateData.stock)
  }
  if (updateData.discount_type !== undefined) {
    fields.push('discount_type = ?')
    values.push(updateData.discount_type)
  }
  if (updateData.discount_value !== undefined) {
    fields.push('discount_value = ?')
    values.push(updateData.discount_value)
  }
  if (updateData.discount_start_date !== undefined) {
    fields.push('discount_start_date = ?')
    values.push(updateData.discount_start_date)
  }
  if (updateData.discount_end_date !== undefined) {
    fields.push('discount_end_date = ?')
    values.push(updateData.discount_end_date)
  }
  if (updateData.is_on_clearance !== undefined) {
    fields.push('is_on_clearance = ?')
    values.push(updateData.is_on_clearance)
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
 * Get clearance products (products with active discounts)
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Products and pagination info
 */
export const getClearanceProducts = async (filters = {}) => {
  const {
    page = 1,
    limit = 12,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = filters

  const offset = (page - 1) * limit
  const now = new Date()

  // Get products with active discounts
  const [rows] = await db.execute(
    `SELECT p.*, 
            cc.name as child_category_name,
            cc.id as child_category_id,
            s.name as subcategory_name,
            s.id as subcategory_id,
            c.name as category_name,
            c.id as category_id
     FROM products p 
     JOIN child_categories cc ON p.child_category_id = cc.id
     JOIN subcategories s ON cc.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     WHERE p.is_on_clearance = ?
     AND p.discount_type IS NOT NULL
     AND p.discount_value IS NOT NULL
     AND p.discount_start_date <= ?
     AND p.discount_end_date >= ?
     ORDER BY p.${sortBy} ${sortOrder}
     LIMIT ? OFFSET ?`,
    [true, now, now, limit, offset]
  )

  // Get total count
  const [countResult] = await db.execute(
    `SELECT COUNT(*) as total 
     FROM products p
     JOIN child_categories cc ON p.child_category_id = cc.id
     JOIN subcategories s ON cc.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     WHERE p.is_on_clearance = ?
     AND p.discount_type IS NOT NULL
     AND p.discount_value IS NOT NULL
     AND p.discount_start_date <= ?
     AND p.discount_end_date >= ?`,
    [true, now, now]
  )
  const total = countResult[0].total

  // Get images for each product
  const productIds = rows.map(p => p.id)
  const imagesMap = await productMediaModel.getProductsImages(productIds)

  // Attach images and calculate discounted prices
  const productsWithImages = rows.map(product => {
    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discount_type,
      product.discount_value
    )
    
    return {
      ...product,
      images: imagesMap[product.id] || [],
      discounted_price: discountedPrice,
      has_discount: true
    }
  })

  return {
    products: productsWithImages,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

// Re-export media functions for convenience
export { addProductImage, addProductVideo } from './productMediaModel.js'

