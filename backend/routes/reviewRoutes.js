/**
 * Review Routes
 * Handles all product review related API endpoints
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import { body, validationResult } from 'express-validator'
import * as reviewModel from '../models/reviewModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * GET /api/products/:productId/reviews
 * Get reviews for a product
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/products/:productId/reviews', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const result = await reviewModel.getProductReviews(productId, { page, limit })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/products/:productId/reviews
 * Create review for a product (only if user purchased it)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post(
  '/products/:productId/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const productId = parseInt(req.params.productId)
      if (isNaN(productId) || productId <= 0) {
        return res.status(400).json({ message: 'Invalid product ID' })
      }
      const userId = req.user.id

      // Check if user has already reviewed this product
      const hasReviewed = await reviewModel.hasUserReviewedProduct(userId, productId)
      if (hasReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this product' })
      }

      // Check if user has purchased this product
      const hasPurchased = await reviewModel.hasUserPurchasedProduct(userId, productId)
      if (!hasPurchased) {
        return res.status(403).json({ message: 'You can only review products you have purchased' })
      }

      // Create review
      const reviewId = await reviewModel.createReview({
        product_id: productId,
        user_id: userId,
        rating: parseInt(req.body.rating),
        comment: req.body.comment,
      })

      const review = await reviewModel.getReviewById(reviewId)
      res.status(201).json(review)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * PUT /api/reviews/:id
 * Update review (own review only)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put(
  '/:id',
  protect,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().notEmpty().withMessage('Comment cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const reviewId = parseInt(req.params.id)
      if (isNaN(reviewId) || reviewId <= 0) {
        return res.status(400).json({ message: 'Invalid review ID' })
      }
      const review = await reviewModel.getReviewById(reviewId)

      if (!review) {
        return res.status(404).json({ message: 'Review not found' })
      }

      // Check if user owns this review
      if (review.user_id !== req.user.id) {
        return res.status(403).json({ message: 'You can only edit your own reviews' })
      }

      const updateData = {}
      if (req.body.rating !== undefined) updateData.rating = parseInt(req.body.rating)
      if (req.body.comment) updateData.comment = req.body.comment

      const updatedReview = await reviewModel.updateReview(reviewId, updateData)
      res.json(updatedReview)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * DELETE /api/reviews/:id
 * Delete review (own review or admin)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id)
    if (isNaN(reviewId) || reviewId <= 0) {
      return res.status(400).json({ message: 'Invalid review ID' })
    }
    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    // Check if user owns this review or is admin
    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' })
    }

    await reviewModel.deleteReview(reviewId)
    res.json({ message: 'Review deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

