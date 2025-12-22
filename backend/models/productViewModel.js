/**
 * Product View Model
 * Handles all database operations related to product views
 * Supports both authenticated users and guest sessions
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'
import * as productMediaModel from './productMediaModel.js'

/**
 * Calculate discounted price
 * @param {number} price - Original price
 * @param {string} discountType - 'percentage' or 'fixed'
 * @param {number} discountValue - Discount value
 * @returns {number} - Discounted price
 * @author Thang Truong
 * @date 2025-12-12
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
 * Check if discount is active
 * @param {string} discountStartDate - Start date
 * @param {string} discountEndDate - End date
 * @returns {boolean} - True if discount is active
 * @author Thang Truong
 * @date 2025-12-12
 */
const isDiscountActive = (discountStartDate, discountEndDate) => {
  if (!discountStartDate || !discountEndDate) return false
  const now = new Date()
  const start = new Date(discountStartDate)
  const end = new Date(discountEndDate)
  return now >= start && now <= end
}

/**
 * Record a product view
 * @param {number} productId - Product ID
 * @param {number|null} userId - User ID (null for guest)
 * @param {string|null} sessionId - Session ID (for guest users)
 * @returns {Promise<number>} - Inserted view ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const recordProductView = async (productId, userId = null, sessionId = null) => {
  // Prevent duplicate views within 5 minutes for same user/session and product
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  
  if (userId) {
    const [existing] = await db.execute(
      'SELECT id FROM product_views WHERE user_id = ? AND product_id = ? AND viewed_at > ?',
      [userId, productId, fiveMinutesAgo]
    )
    if (existing.length > 0) {
      return existing[0].id // Return existing view ID
    }
  } else if (sessionId) {
    const [existing] = await db.execute(
      'SELECT id FROM product_views WHERE session_id = ? AND product_id = ? AND viewed_at > ?',
      [sessionId, productId, fiveMinutesAgo]
    )
    if (existing.length > 0) {
      return existing[0].id // Return existing view ID
    }
  }

  const [result] = await db.execute(
    'INSERT INTO product_views (product_id, user_id, session_id) VALUES (?, ?, ?)',
    [productId, userId, sessionId]
  )
  return result.insertId
}

/**
 * Get recently viewed products
 * @param {number|null} userId - User ID (null for guest)
 * @param {string|null} sessionId - Session ID (for guest users)
 * @param {number} limit - Maximum number of items to return
 * @returns {Promise<Array>} - Array of recently viewed products
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getRecentlyViewed = async (userId = null, sessionId = null, limit = 15) => {
  try {
    // Return empty if no user or session
    if (!userId && !sessionId) {
      return []
    }

    let query = `
      SELECT DISTINCT pv.product_id, MAX(pv.viewed_at) as last_viewed_at
      FROM product_views pv
      WHERE `
    const params = []

    if (userId) {
      query += 'pv.user_id = ?'
      params.push(userId)
    } else if (sessionId) {
      query += 'pv.session_id = ?'
      params.push(sessionId)
    }

    const limitInt = parseInt(limit, 10) || 15
    if (isNaN(limitInt) || limitInt < 1) {
      return []
    }

    query += `
      GROUP BY pv.product_id
      ORDER BY last_viewed_at DESC
      LIMIT ${limitInt}`

    const [rows] = await db.execute(query, params)
    
    if (rows.length === 0) return []

    const productIds = rows.map(row => row.product_id)
    
    if (productIds.length === 0) return []
    
    // Get product details
    const [products] = await db.execute(
      `SELECT p.*, 
              cc.name as child_category_name,
              s.name as subcategory_name,
              c.name as category_name
       FROM products p
       JOIN child_categories cc ON p.child_category_id = cc.id
       JOIN subcategories s ON cc.subcategory_id = s.id
       JOIN categories c ON s.category_id = c.id
       WHERE p.id IN (${productIds.map(() => '?').join(',')})
       ORDER BY FIELD(p.id, ${productIds.map(() => '?').join(',')})`,
      [...productIds, ...productIds]
    )

    if (products.length === 0) return []

    // Get images for products
    const imagesMap = await productMediaModel.getProductsImages(productIds)

    // Attach images and calculate discounted prices
    const productsWithImages = products.map(product => {
    const price = parseFloat(product.price) || 0
    const isActive = isDiscountActive(product.discount_start_date, product.discount_end_date)
    // Apply discount if active and discount fields exist (independent of clearance status)
    const hasDiscountFields = product.discount_type && product.discount_value
    const discountedPrice = isActive && hasDiscountFields
      ? calculateDiscountedPrice(price, product.discount_type, product.discount_value)
      : price

    return {
      ...product,
      price: price,
      images: imagesMap[product.id] || [],
      discounted_price: discountedPrice,
      has_discount: isActive && hasDiscountFields,
        last_viewed_at: rows.find(r => r.product_id === product.id)?.last_viewed_at
      }
    })

    return productsWithImages
  } catch (error) {
    // Return empty array on error
    return []
  }
}

/**
 * Clear recently viewed history
 * @param {number|null} userId - User ID (null for guest)
 * @param {string|null} sessionId - Session ID (for guest users)
 * @returns {Promise<boolean>} - Success status
 * @author Thang Truong
 * @date 2025-12-12
 */
export const clearRecentlyViewed = async (userId = null, sessionId = null) => {
  if (userId) {
    await db.execute('DELETE FROM product_views WHERE user_id = ?', [userId])
  } else if (sessionId) {
    await db.execute('DELETE FROM product_views WHERE session_id = ?', [sessionId])
  } else {
    return false
  }
  return true
}

/**
 * Get product recommendations
 * @param {number|null} productId - Product ID (optional, for similar products)
 * @param {number|null} userId - User ID (null for guest)
 * @param {string|null} sessionId - Session ID (for guest users)
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} - Array of recommended products
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getRecommendations = async (productId = null, userId = null, sessionId = null, limit = 15) => {
  try {
    const excludeIds = []

    // Exclude products user has already viewed
    if (userId) {
      try {
        const [viewed] = await db.execute(
          'SELECT DISTINCT product_id FROM product_views WHERE user_id = ?',
          [userId]
        )
        if (viewed && viewed.length > 0) {
          excludeIds.push(...viewed.map(v => v.product_id))
        }
      } catch (err) {
        // Table might not exist yet, continue without exclusions
      }
    } else if (sessionId) {
      try {
        const [viewed] = await db.execute(
          'SELECT DISTINCT product_id FROM product_views WHERE session_id = ?',
          [sessionId]
        )
        if (viewed && viewed.length > 0) {
          excludeIds.push(...viewed.map(v => v.product_id))
        }
      } catch (err) {
        // Table might not exist yet, continue without exclusions
      }
    }

    // If productId provided, get similar products
    let categoryFilter = ''
    const params = []
    
    if (productId) {
      excludeIds.push(productId) // Exclude the current product
      
      try {
        // Get product's category info
        const [productInfo] = await db.execute(
          `SELECT p.child_category_id, cc.subcategory_id, s.category_id
           FROM products p
           JOIN child_categories cc ON p.child_category_id = cc.id
           JOIN subcategories s ON cc.subcategory_id = s.id
           WHERE p.id = ?`,
          [productId]
        )

        if (productInfo.length > 0) {
          const { child_category_id, subcategory_id, category_id } = productInfo[0]
          // Priority: Same child category, subcategory, or category
          categoryFilter = ` AND (p.child_category_id = ? OR cc.subcategory_id = ? OR s.category_id = ?)`
          params.push(child_category_id, subcategory_id, category_id)
        }
      } catch (err) {
        // Product not found or error, continue without category filter
      }
    }

    // Build main query
    let query = `
      SELECT DISTINCT p.*,
             cc.name as child_category_name,
             s.name as subcategory_name,
             c.name as category_name,
             COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = p.id), 0) as rating,
             COALESCE((SELECT COUNT(*) FROM reviews WHERE product_id = p.id), 0) as num_reviews
      FROM products p
      JOIN child_categories cc ON p.child_category_id = cc.id
      JOIN subcategories s ON cc.subcategory_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE p.stock > 0
    `
    
    query += categoryFilter

    // Exclude already viewed products (only if there are any)
    if (excludeIds.length > 0) {
      query += ` AND p.id NOT IN (${excludeIds.map(() => '?').join(',')})`
      params.push(...excludeIds)
    }

    // Order by rating and popularity
    const limitInt = parseInt(limit, 10) || 15
    if (isNaN(limitInt) || limitInt < 1) {
      return []
    }
    
    query += ` ORDER BY rating DESC, num_reviews DESC, p.created_at DESC LIMIT ${limitInt}`

    const [products] = await db.execute(query, params)

    if (products.length === 0) {
      // Fallback: Get popular products
      let fallbackQuery = `
        SELECT p.*,
               cc.name as child_category_name,
               s.name as subcategory_name,
               c.name as category_name,
               COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = p.id), 0) as rating,
               COALESCE((SELECT COUNT(*) FROM reviews WHERE product_id = p.id), 0) as num_reviews
        FROM products p
        JOIN child_categories cc ON p.child_category_id = cc.id
        JOIN subcategories s ON cc.subcategory_id = s.id
        JOIN categories c ON s.category_id = c.id
        WHERE p.stock > 0
      `
      const fallbackParams = []
      
      if (excludeIds.length > 0) {
        fallbackQuery += ` AND p.id NOT IN (${excludeIds.map(() => '?').join(',')})`
        fallbackParams.push(...excludeIds)
      }
      
      fallbackQuery += ` ORDER BY rating DESC, num_reviews DESC, p.created_at DESC LIMIT ${limitInt}`
      
      const [fallback] = await db.execute(fallbackQuery, fallbackParams)
      return await attachProductMedia(fallback)
    }

    return await attachProductMedia(products)
  } catch (error) {
    // Return empty array on error
    return []
  }
}

/**
 * Attach images and calculate discounted prices for products
 * @param {Array} products - Array of products
 * @returns {Promise<Array>} - Products with images and discounted prices
 * @author Thang Truong
 * @date 2025-12-12
 */
const attachProductMedia = async (products) => {
  if (products.length === 0) return []

  const productIds = products.map(p => p.id)
  const imagesMap = await productMediaModel.getProductsImages(productIds)

  return products.map(product => {
    const price = parseFloat(product.price) || 0
    const isActive = isDiscountActive(product.discount_start_date, product.discount_end_date)
    // Apply discount if active and discount fields exist (independent of clearance status)
    const hasDiscountFields = product.discount_type && product.discount_value
    const discountedPrice = isActive && hasDiscountFields
      ? calculateDiscountedPrice(price, product.discount_type, product.discount_value)
      : price

    return {
      ...product,
      price: price,
      images: imagesMap[product.id] || [],
      discounted_price: discountedPrice,
      has_discount: isActive && hasDiscountFields,
      rating: parseFloat(product.rating) || 0,
      num_reviews: parseInt(product.num_reviews) || 0
    }
  })
}


// ============ ADMIN FUNCTIONS ============

/**
 * Get all product views with filters and pagination (Admin)
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} - Product views and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllProductViews = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = null,
      userId = null,
      productId = null,
      userType = null,
      sortBy = 'viewed_at',
      sortOrder = 'DESC',
      startDate = null,
      endDate = null
    } = filters

    // Validate and convert to integers to avoid MySQL prepared statement issues
    const limitInt = parseInt(limit, 10) || 20
    const pageInt = parseInt(page, 10) || 1
    const offsetInt = (pageInt - 1) * limitInt
    
    if (isNaN(limitInt) || isNaN(offsetInt) || limitInt < 1 || offsetInt < 0) {
      throw new Error('Invalid pagination parameters')
    }

    const conditions = []
    const whereValues = []

    // Build WHERE clause
    if (search) {
      conditions.push(`(p.name LIKE ? OR u.name LIKE ? OR u.email LIKE ? OR pv.session_id LIKE ?)`)
      const searchTerm = `%${search}%`
      whereValues.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    if (userId) {
      conditions.push('pv.user_id = ?')
      whereValues.push(parseInt(userId, 10))
    }

    if (productId) {
      conditions.push('pv.product_id = ?')
      whereValues.push(parseInt(productId, 10))
    }

    if (userType === 'authenticated') {
      conditions.push('pv.user_id IS NOT NULL')
    } else if (userType === 'guest') {
      conditions.push('pv.user_id IS NULL')
    }

    if (startDate) {
      conditions.push('pv.viewed_at >= ?')
      whereValues.push(startDate)
    }

    if (endDate) {
      conditions.push('pv.viewed_at <= ?')
      whereValues.push(endDate)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Validate sortBy - map frontend fields to database fields
    const sortFieldMap = {
      'id': 'pv.id',
      'viewed_at': 'pv.viewed_at',
      'product_id': 'pv.product_id',
      'user_id': 'pv.user_id',
      'product_name': 'p.name',
      'user_name': 'u.name',
      'user_email': 'u.email'
    }
    const sanitizedSortBy = sortFieldMap[sortBy] || 'pv.viewed_at'
    const sanitizedSortOrder = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    // Build query with LIMIT and OFFSET using template literals (like other models)
    const query = `
      SELECT pv.*,
             p.name as product_name,
             p.price as product_price,
             u.name as user_name,
             u.email as user_email,
             (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as product_image
      FROM product_views pv
      LEFT JOIN products p ON pv.product_id = p.id
      LEFT JOIN users u ON pv.user_id = u.id
      ${whereClause}
      ORDER BY ${sanitizedSortBy} ${sanitizedSortOrder}
      LIMIT ${limitInt} OFFSET ${offsetInt}
    `

    const [rows] = await db.execute(query, whereValues)

    // Get total count (same WHERE clause, no LIMIT/OFFSET)
    const countQuery = `
      SELECT COUNT(*) as total
      FROM product_views pv
      LEFT JOIN products p ON pv.product_id = p.id
      LEFT JOIN users u ON pv.user_id = u.id
      ${whereClause}
    `

    const [countResult] = await db.execute(countQuery, whereValues)
    const total = countResult[0]?.total || 0

    return {
      views: rows,
      pagination: {
        page: pageInt,
        limit: limitInt,
        total,
        pages: Math.ceil(total / limitInt)
      }
    }
  } catch (error) {
    throw new Error(`Failed to fetch product views: ${error.message}`)
  }
}

/**
 * Get single product view by ID (Admin)
 * @param {number} id - View ID
 * @returns {Promise<Object|null>} - Product view or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductViewById = async (id) => {
  const [rows] = await db.execute(
    `SELECT pv.*,
            p.name as product_name,
            p.description as product_description,
            p.price as product_price,
            u.name as user_name,
            u.email as user_email
     FROM product_views pv
     LEFT JOIN products p ON pv.product_id = p.id
     LEFT JOIN users u ON pv.user_id = u.id
     WHERE pv.id = ?`,
    [id]
  )
  return rows.length > 0 ? rows[0] : null
}

/**
 * Delete single product view (Admin)
 * @param {number} id - View ID
 * @returns {Promise<boolean>} - Success status
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteProductView = async (id) => {
  const [result] = await db.execute('DELETE FROM product_views WHERE id = ?', [id])
  return result.affectedRows > 0
}

/**
 * Bulk delete product views (Admin)
 * @param {Array<number>} ids - Array of view IDs
 * @returns {Promise<number>} - Number of deleted views
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkDeleteProductViews = async (ids) => {
  if (!ids || ids.length === 0) return 0
  const placeholders = ids.map(() => '?').join(',')
  const [result] = await db.execute(
    `DELETE FROM product_views WHERE id IN (${placeholders})`,
    ids
  )
  return result.affectedRows
}

/**
 * Delete all views for a user (Admin)
 * @param {number} userId - User ID
 * @returns {Promise<number>} - Number of deleted views
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteViewsByUserId = async (userId) => {
  const [result] = await db.execute('DELETE FROM product_views WHERE user_id = ?', [userId])
  return result.affectedRows
}

/**
 * Delete all views for a session (Admin)
 * @param {string} sessionId - Session ID
 * @returns {Promise<number>} - Number of deleted views
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteViewsBySessionId = async (sessionId) => {
  const [result] = await db.execute('DELETE FROM product_views WHERE session_id = ?', [sessionId])
  return result.affectedRows
}

/**
 * Get product view analytics (Admin)
 * @param {string} period - Time period (today, week, month, year, all)
 * @param {string|null} startDate - Start date
 * @param {string|null} endDate - End date
 * @returns {Promise<Object>} - Analytics data
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductViewAnalytics = async (period = 'month', startDate = null, endDate = null) => {
  let dateCondition = ''
  const params = []

  if (startDate && endDate) {
    dateCondition = 'WHERE pv.viewed_at >= ? AND pv.viewed_at <= ?'
    params.push(startDate, endDate)
  } else {
    const now = new Date()
    let start = new Date()

    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
      default:
        dateCondition = ''
    }

    if (dateCondition === '' && period !== 'all') {
      dateCondition = 'WHERE pv.viewed_at >= ?'
      params.push(start.toISOString().slice(0, 19).replace('T', ' '))
    }
  }

  // Total views
  const [totalResult] = await db.execute(
    `SELECT COUNT(*) as total FROM product_views pv ${dateCondition}`,
    params
  )

  // Top viewed products
  const [topProducts] = await db.execute(
    `SELECT p.id, p.name, COUNT(*) as view_count
     FROM product_views pv
     JOIN products p ON pv.product_id = p.id
     ${dateCondition}
     GROUP BY p.id, p.name
     ORDER BY view_count DESC
     LIMIT 10`,
    params
  )

  // Most active users (authenticated)
  const [topUsers] = await db.execute(
    `SELECT u.id, u.name, u.email, COUNT(*) as view_count
     FROM product_views pv
     JOIN users u ON pv.user_id = u.id
     ${dateCondition}
     GROUP BY u.id, u.name, u.email
     ORDER BY view_count DESC
     LIMIT 10`,
    params
  )

  // Guest vs Authenticated ratio
  const [userTypeStats] = await db.execute(
    `SELECT 
       COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as authenticated_views,
       COUNT(CASE WHEN user_id IS NULL THEN 1 END) as guest_views
     FROM product_views pv
     ${dateCondition}`,
    params
  )

  return {
    totalViews: totalResult[0]?.total || 0,
    topProducts,
    topUsers,
    userTypeStats: userTypeStats[0] || { authenticated_views: 0, guest_views: 0 }
  }
}

/**
 * Get product view statistics (Admin)
 * @param {string} period - Time period
 * @param {string|null} startDate - Start date
 * @param {string|null} endDate - End date
 * @returns {Promise<Object>} - Statistics data
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductViewStatistics = async (period = 'month', startDate = null, endDate = null) => {
  let dateCondition = ''
  const params = []

  if (startDate && endDate) {
    dateCondition = 'WHERE pv.viewed_at >= ? AND pv.viewed_at <= ?'
    params.push(startDate, endDate)
  } else {
    const now = new Date()
    let start = new Date()

    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start.setDate(now.getDate() - 7)
        break
      case 'month':
        start.setMonth(now.getMonth() - 1)
        break
      case 'year':
        start.setFullYear(now.getFullYear() - 1)
        break
    }

    if (period !== 'all') {
      dateCondition = 'WHERE pv.viewed_at >= ?'
      params.push(start.toISOString().slice(0, 19).replace('T', ' '))
    }
  }

  // Views per day
  const [viewsPerDay] = await db.execute(
    `SELECT DATE(pv.viewed_at) as date, COUNT(*) as count
     FROM product_views pv
     ${dateCondition}
     GROUP BY DATE(pv.viewed_at)
     ORDER BY date DESC
     LIMIT 30`,
    params
  )

  // Unique products viewed
  const [uniqueProducts] = await db.execute(
    `SELECT COUNT(DISTINCT product_id) as count
     FROM product_views pv
     ${dateCondition}`,
    params
  )

  // Unique users/sessions
  const [uniqueUsers] = await db.execute(
    `SELECT 
       COUNT(DISTINCT user_id) as authenticated_users,
       COUNT(DISTINCT session_id) as guest_sessions
     FROM product_views pv
     ${dateCondition}`,
    params
  )

  return {
    viewsPerDay,
    uniqueProducts: uniqueProducts[0]?.count || 0,
    uniqueUsers: uniqueUsers[0] || { authenticated_users: 0, guest_sessions: 0 }
  }
}
