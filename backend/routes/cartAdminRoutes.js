/**
 * Cart Admin Routes
 * Handles CRUD operations for carts (admin only)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as cartModel from '../models/cartModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, admin)

/**
 * GET /api/admin/carts
 * Get all carts with pagination and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      userId: req.query.userId ? parseInt(req.query.userId) : null,
      search: req.query.search || null,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'desc'
    }
    const result = await cartModel.getAllCarts(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'No carts found matching your search',
      carts: [],
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        total: 0,
        pages: 1
      }
    })
  }
})

/**
 * GET /api/admin/carts/:id
 * Get cart details with items
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/:id', async (req, res) => {
  try {
    const cartId = parseInt(req.params.id)
    
    if (isNaN(cartId) || cartId <= 0) {
      return res.status(400).json({ message: 'Invalid cart ID' })
    }
    
    const cart = await cartModel.getCartById(cartId)
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/carts/:id/items
 * Get cart items for a specific cart
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/:id/items', async (req, res) => {
  try {
    const cartId = parseInt(req.params.id)
    
    if (isNaN(cartId) || cartId <= 0) {
      return res.status(400).json({ message: 'Invalid cart ID' })
    }
    
    const cart = await cartModel.getCartById(cartId)
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    
    res.json({ items: cart.items || [] })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/carts/:id
 * Delete cart (cascade deletes cart_items)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/:id', async (req, res) => {
  try {
    const cartId = parseInt(req.params.id)
    
    if (isNaN(cartId) || cartId <= 0) {
      return res.status(400).json({ message: 'Invalid cart ID' })
    }
    
    const cart = await cartModel.getCartById(cartId)
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    
    const deleted = await cartModel.deleteCart(cartId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete cart' })
    }
    
    res.json({ message: 'Cart deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/carts/bulk-delete
 * Bulk delete carts
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/bulk-delete', async (req, res) => {
  try {
    const { cartIds } = req.body
    
    if (!Array.isArray(cartIds) || cartIds.length === 0) {
      return res.status(400).json({ message: 'Cart IDs array is required' })
    }
    
    const deleted = []
    const errors = []
    
    for (const cartId of cartIds) {
      try {
        const id = parseInt(cartId)
        if (isNaN(id) || id <= 0) {
          errors.push({ id: cartId, error: 'Invalid cart ID' })
          continue
        }
        
        const result = await cartModel.deleteCart(id)
        if (result) {
          deleted.push(id)
        } else {
          errors.push({ id, error: 'Cart not found' })
        }
      } catch (error) {
        errors.push({ id: cartId, error: error.message })
      }
    }
    
    res.json({
      message: `${deleted.length} cart(s) deleted successfully`,
      deleted,
      errors
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
