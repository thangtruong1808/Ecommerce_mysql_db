/**
 * Cart Model
 * Handles all database operations related to shopping carts
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Get or create cart for user
 * @param {number} userId - User ID
 * @returns {Promise<number>} - Cart ID
 */
export const getOrCreateCart = async (userId) => {
  // Try to get existing cart
  const [rows] = await db.execute(
    'SELECT id FROM carts WHERE user_id = ?',
    [userId]
  )

  if (rows.length > 0) {
    return rows[0].id
  }

  // Create new cart if doesn't exist
  const [result] = await db.execute(
    'INSERT INTO carts (user_id) VALUES (?)',
    [userId]
  )
  return result.insertId
}

/**
 * Get cart with items and product details
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} - Cart with items or null
 */
export const getCartWithItems = async (userId) => {
  const cartId = await getOrCreateCart(userId)

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
    [cartId]
  )

  return {
    cartId,
    items: rows
  }
}

/**
 * Add item to cart
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise<boolean>} - True if added, false otherwise
 */
export const addItemToCart = async (userId, productId, quantity = 1) => {
  const cartId = await getOrCreateCart(userId)

  // Check if item already exists in cart
  const [existing] = await db.execute(
    'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
    [cartId, productId]
  )

  if (existing.length > 0) {
    // Update quantity if item exists
    const newQuantity = existing[0].quantity + quantity
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [newQuantity, existing[0].id]
    )
  } else {
    // Insert new item
    await db.execute(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
      [cartId, productId, quantity]
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
 * Clear all items from cart
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - True if cleared, false otherwise
 */
export const clearCart = async (userId) => {
  const cartId = await getOrCreateCart(userId)
  const [result] = await db.execute(
    'DELETE FROM cart_items WHERE cart_id = ?',
    [cartId]
  )
  return result.affectedRows >= 0
}

