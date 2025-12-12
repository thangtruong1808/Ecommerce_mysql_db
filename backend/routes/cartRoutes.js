/**
 * Cart Routes
 * Handles all shopping cart related API endpoints
 * Supports both authenticated users and guest sessions
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import crypto from 'crypto'
import * as cartModel from '../models/cartModel.js'
import { protect, optionalAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * Get or create session ID and cart ID from cookies
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
const getSessionId = (req, res, next) => {
  let sessionId = req.cookies?.guest_session_id
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    res.cookie('guest_session_id', sessionId, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
  }
  req.guestSessionId = sessionId
  req.guestCartId = req.cookies?.guest_cart_id ? parseInt(req.cookies.guest_cart_id) : null
  next()
}

/**
 * GET /api/cart
 * Get user's cart with all items (works for both authenticated and guest users)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', getSessionId, optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || 0
    const sessionId = req.user ? null : req.guestSessionId
    const cartId = req.user ? null : req.guestCartId
    const cart = await cartModel.getCartWithItems(userId, sessionId, cartId)
    if (!req.user && cart.cartId) {
      res.cookie('guest_cart_id', cart.cartId.toString(), { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/cart
 * Add item to cart (works for both authenticated and guest users)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/', getSessionId, optionalAuth, async (req, res) => {
  try {
    const { product_id, quantity } = req.body
    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' })
    }
    const userId = req.user?.id || 0
    const sessionId = req.user ? null : req.guestSessionId
    const cartId = req.user ? null : req.guestCartId
    const qty = quantity || 1
    await cartModel.addItemToCart(userId, parseInt(product_id), parseInt(qty), sessionId, cartId)
    const cart = await cartModel.getCartWithItems(userId, sessionId, cartId)
    if (!req.user && cart.cartId) {
      res.cookie('guest_cart_id', cart.cartId.toString(), { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    }
    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/cart/:itemId
 * Update cart item quantity (works for both authenticated and guest users)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/:itemId', getSessionId, optionalAuth, async (req, res) => {
  try {
    const { quantity } = req.body
    const itemId = parseInt(req.params.itemId)
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' })
    }
    const updated = await cartModel.updateCartItemQuantity(itemId, parseInt(quantity))
    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' })
    }
    const userId = req.user?.id || 0
    const sessionId = req.user ? null : req.guestSessionId
    const cartId = req.user ? null : req.guestCartId
    const cart = await cartModel.getCartWithItems(userId, sessionId, cartId)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/cart/:itemId
 * Remove item from cart (works for both authenticated and guest users)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/:itemId', getSessionId, optionalAuth, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    const deleted = await cartModel.removeCartItem(itemId)
    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' })
    }
    const userId = req.user?.id || 0
    const sessionId = req.user ? null : req.guestSessionId
    const cartId = req.user ? null : req.guestCartId
    const cart = await cartModel.getCartWithItems(userId, sessionId, cartId)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/cart
 * Clear all items from cart (works for both authenticated and guest users)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/', getSessionId, optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || 0
    const sessionId = req.user ? null : req.guestSessionId
    const cartId = req.user ? null : req.guestCartId
    await cartModel.clearCart(userId, sessionId, cartId)
    const cart = await cartModel.getCartWithItems(userId, sessionId, cartId)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/cart/transfer
 * Transfer guest cart to user cart when user logs in
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/transfer', getSessionId, protect, async (req, res) => {
  try {
    const guestCartId = req.guestCartId
    if (guestCartId) {
      await cartModel.transferGuestCartToUser(guestCartId, req.user.id)
      res.clearCookie('guest_session_id')
      res.clearCookie('guest_cart_id')
    }
    const cart = await cartModel.getCartWithItems(req.user.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

