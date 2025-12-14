/**
 * Product View Routes
 * Handles all product view related API endpoints
 * Supports both authenticated users and guest sessions
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as productViewModel from '../models/productViewModel.js'
import { optionalAuth } from '../middleware/authMiddleware.js'
import { getSessionId } from '../middleware/sessionMiddleware.js'

const router = express.Router()

/**
 * POST /api/product-views
 * Record a product view
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/', getSessionId, optionalAuth, async (req, res) => {
  try {
    const { product_id } = req.body
    
    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' })
    }

    const userId = req.user?.id || null
    const sessionId = req.user ? null : req.guestSessionId

    await productViewModel.recordProductView(parseInt(product_id), userId, sessionId)
    
    res.status(201).json({ message: 'Product view recorded' })
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to record product view',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

/**
 * GET /api/product-views/recent
 * Get recently viewed products
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/recent', getSessionId, optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15
    const userId = req.user?.id || null
    const sessionId = req.user ? null : req.guestSessionId

    const products = await productViewModel.getRecentlyViewed(userId, sessionId, limit)
    
    res.json({ products })
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to fetch recently viewed products',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

/**
 * DELETE /api/product-views/recent
 * Clear recently viewed history
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/recent', getSessionId, optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || null
    const sessionId = req.user ? null : req.guestSessionId

    await productViewModel.clearRecentlyViewed(userId, sessionId)
    
    res.json({ message: 'Recently viewed history cleared' })
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to clear recently viewed history',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

/**
 * GET /api/product-views/recommendations/:productId
 * Get recommendations for a specific product
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/recommendations/:productId', getSessionId, optionalAuth, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const limit = parseInt(req.query.limit) || 15
    const userId = req.user?.id || null
    const sessionId = req.user ? null : req.guestSessionId

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const products = await productViewModel.getRecommendations(productId, userId, sessionId, limit)
    
    res.json({ products })
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to fetch recommendations',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

/**
 * GET /api/product-views/recommendations
 * Get general recommendations
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/recommendations', getSessionId, optionalAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 15
    const userId = req.user?.id || null
    const sessionId = req.user ? null : req.guestSessionId

    const products = await productViewModel.getRecommendations(null, userId, sessionId, limit)
    
    res.json({ products })
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to fetch recommendations',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

export default router
