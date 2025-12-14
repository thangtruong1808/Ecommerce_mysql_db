/**
 * Cart Model
 * Handles all database operations related to shopping carts
 * Supports both authenticated users and guest sessions
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Get or create cart for user
 * @param {number} userId - User ID (0 for guest)
 * @param {string} sessionId - Session ID for guest carts
 * @returns {Promise<number>} - Cart ID
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getOrCreateCart = async (userId, sessionId = null, cartId = null) => {
  if (userId === 0 && cartId) {
    // Use provided guest cart ID if valid (guest carts have user_id = NULL)
    const [rows] = await db.execute('SELECT id FROM carts WHERE id = ? AND user_id IS NULL', [cartId])
    if (rows.length > 0) {
      return rows[0].id
    }
  }
  if (userId === 0) {
    // Create new guest cart with NULL user_id
    const [result] = await db.execute('INSERT INTO carts (user_id) VALUES (NULL)', [])
    return result.insertId
  }
  const [rows] = await db.execute('SELECT id FROM carts WHERE user_id = ?', [userId])
  if (rows.length > 0) {
    return rows[0].id
  }
  const [result] = await db.execute('INSERT INTO carts (user_id) VALUES (?)', [userId])
  return result.insertId
}

/**
 * Get cart with items and product details
 * @param {number} userId - User ID (0 for guest)
 * @param {string} sessionId - Session ID for guest carts
 * @returns {Promise<Object|null>} - Cart with items or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getCartWithItems = async (userId, sessionId = null, cartId = null) => {
  const finalCartId = await getOrCreateCart(userId, sessionId, cartId)

  // Get cart items with product details
  const [rows] = await db.execute(
    `SELECT 
      ci.id as cart_item_id,
      ci.quantity,
      p.id as product_id,
      p.name,
      p.price,
      p.stock,
      p.rating,
      pi.image_url as image_url
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
     WHERE ci.cart_id = ?
     ORDER BY ci.created_at DESC`,
    [finalCartId]
  )

  return {
    cartId: finalCartId,
    items: rows
  }
}

/**
 * Add item to cart
 * @param {number} userId - User ID (0 for guest)
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @param {string} sessionId - Session ID for guest carts
 * @returns {Promise<boolean>} - True if added, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const addItemToCart = async (userId, productId, quantity = 1, sessionId = null, cartId = null) => {
  const finalCartId = await getOrCreateCart(userId, sessionId, cartId)

  const [existing] = await db.execute(
    'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [finalCartId, productId]
  )

  if (existing.length > 0) {
    // Update quantity if item exists
    const newQuantity = existing[0].quantity + quantity
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existing[0].id]
    )
  } else {
    await db.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [finalCartId, productId, quantity]
    )
  }

  return true
}

/**
 * Update cart item quantity
 * @param {number} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<boolean>} - True if updated, false otherwise
 */
export const updateCartItemQuantity = async (itemId, quantity) => {
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    return removeCartItem(itemId)
  }

  const [result] = await db.execute(
    'UPDATE cart_items SET quantity = ? WHERE id = ?',
    [quantity, itemId]
  )
  return result.affectedRows > 0
}

/**
 * Remove item from cart
 * @param {number} itemId - Cart item ID
 * @returns {Promise<boolean>} - True if removed, false otherwise
 */
export const removeCartItem = async (itemId) => {
  const [result] = await db.execute(
    'DELETE FROM cart_items WHERE id = ?',
    [itemId]
  )
  return result.affectedRows > 0
}

/**
 * Transfer guest cart to user cart
 * @param {number} guestCartId - Guest cart ID
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - True if transferred, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const transferGuestCartToUser = async (guestCartId, userId) => {
  const userCartId = await getOrCreateCart(userId, null)
  const [guestItems] = await db.execute('SELECT product_id, quantity FROM cart_items WHERE cart_id = ?', [guestCartId])
  for (const item of guestItems) {
    const [existing] = await db.execute('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [userCartId, item.product_id])
    if (existing.length > 0) {
      await db.execute('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [item.quantity, existing[0].id])
    } else {
      await db.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [userCartId, item.product_id, item.quantity])
    }
  }
  await db.execute('DELETE FROM cart_items WHERE cart_id = ?', [guestCartId])
  await db.execute('DELETE FROM carts WHERE id = ?', [guestCartId])
  return true
}


/**
 * Clear all items from cart
 * @param {number} userId - User ID (0 for guest)
 * @param {string} sessionId - Session ID for guest carts
 * @returns {Promise<boolean>} - True if cleared, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const clearCart = async (userId, sessionId = null, cartId = null) => {
  const finalCartId = await getOrCreateCart(userId, sessionId, cartId)
  const [result] = await db.execute(
    'DELETE FROM cart_items WHERE cart_id = ?',
    [finalCartId]
  )
  return result.affectedRows >= 0
}

/**
 * Get all carts with pagination and filters (admin only)
 * @param {Object} filters - Filter options (page, limit, userId)
 * @returns {Promise<Object>} - Carts with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllCarts = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  const userId = filters.userId ? parseInt(filters.userId) : null
  
  let query = `
    SELECT c.*, 
           u.name as user_name,
           u.email as user_email,
           COUNT(ci.id) as item_count,
           COALESCE(SUM(ci.quantity * p.price), 0) as total_value
    FROM carts c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN cart_items ci ON c.id = ci.cart_id
    LEFT JOIN products p ON ci.product_id = p.id
  `
  const params = []
  
  if (userId && !isNaN(userId)) {
    query += ' WHERE c.user_id = ?'
    params.push(userId)
  } else {
    query += ' WHERE 1=1'
  }
  
  query += ' GROUP BY c.id'
  
  // Get total count
  const countQuery = query.replace(
    'SELECT c.*, u.name as user_name, u.email as user_email, COUNT(ci.id) as item_count, COALESCE(SUM(ci.quantity * p.price), 0) as total_value',
    'SELECT COUNT(DISTINCT c.id) as total'
  )
  const [countResult] = await db.execute(countQuery, params)
  const total = countResult[0].total
  
  query += ' ORDER BY c.created_at DESC'
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute(query, params)
  
  return {
    carts: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get cart by ID with items (admin only)
 * @param {number} cartId - Cart ID
 * @returns {Promise<Object|null>} - Cart with items or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getCartById = async (cartId) => {
  const id = parseInt(cartId)
  if (isNaN(id) || id <= 0) {
    return null
  }
  
  const [cartRows] = await db.execute(
    `SELECT c.*, u.name as user_name, u.email as user_email
     FROM carts c
     LEFT JOIN users u ON c.user_id = u.id
     WHERE c.id = ?`,
    [id]
  )
  
  if (cartRows.length === 0) {
    return null
  }
  
  const cart = cartRows[0]
  
  const [itemRows] = await db.execute(
    `SELECT ci.*, 
            p.name as product_name,
            p.price,
            pi.image_url as product_image
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
     WHERE ci.cart_id = ?
     ORDER BY ci.created_at DESC`,
    [id]
  )
  
  return {
    ...cart,
    items: itemRows
  }
}

/**
 * Delete cart (admin only)
 * @param {number} cartId - Cart ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteCart = async (cartId) => {
  const id = parseInt(cartId)
  if (isNaN(id) || id <= 0) {
    return false
  }
  
  // Cart items will be deleted via CASCADE
  const [result] = await db.execute(
    'DELETE FROM carts WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

