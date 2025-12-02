/**
 * Like Routes
 * Handles all product like related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import * as likeModel from '../models/likeModel.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * POST /api/products/:productId/like
 * Toggle like on a product (protected)
 */
router.post('/products/:productId/like', protect, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const userId = req.user.id

    const result = await likeModel.toggleLike(productId, userId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/:productId/likes
 * Get like count for a product (public)
 */
router.get('/products/:productId/likes', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const count = await likeModel.getProductLikes(productId)
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/:productId/liked
 * Check if user has liked a product (protected)
 */
router.get('/products/:productId/liked', protect, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const userId = req.user.id

    const liked = await likeModel.hasUserLiked(productId, userId)
    res.json({ liked })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/users/liked-products
 * Get user's liked products (protected)
 */
router.get('/users/liked-products', protect, async (req, res) => {
  try {
    const userId = req.user.id
    const products = await likeModel.getUserLikedProducts(userId)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

