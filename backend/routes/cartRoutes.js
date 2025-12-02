/**
 * Cart Routes
 * Handles all shopping cart related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import * as cartModel from '../models/cartModel.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * GET /api/cart
 * Get user's cart with all items
 */
router.get('/', protect, async (req, res) => {
  try {
    const cart = await cartModel.getCartWithItems(req.user.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/cart
 * Add item to cart
 */
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, quantity } = req.body

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    const qty = quantity || 1
    await cartModel.addItemToCart(req.user.id, parseInt(product_id), parseInt(qty))

    const cart = await cartModel.getCartWithItems(req.user.id)
    res.status(201).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/cart/:itemId
 * Update cart item quantity
 */
router.put('/:itemId', protect, async (req, res) => {
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

    const cart = await cartModel.getCartWithItems(req.user.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/cart/:itemId
 * Remove item from cart
 */
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    const deleted = await cartModel.removeCartItem(itemId)

    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    const cart = await cartModel.getCartWithItems(req.user.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/cart
 * Clear all items from cart
 */
router.delete('/', protect, async (req, res) => {
  try {
    await cartModel.clearCart(req.user.id)
    const cart = await cartModel.getCartWithItems(req.user.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

