/**
 * Comment Routes
 * Handles all product comment related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import { body, validationResult } from 'express-validator'
import * as commentModel from '../models/commentModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * POST /api/products/:productId/comments
 * Create comment on a product (protected)
 */
router.post(
  '/products/:productId/comments',
  protect,
  [
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const productId = parseInt(req.params.productId)
      const userId = req.user.id
      const comment = req.body.comment

      const commentId = await commentModel.createComment(productId, userId, comment)
      const newComment = await commentModel.getCommentById(commentId)
      res.status(201).json(newComment)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * GET /api/products/:productId/comments
 * Get product comments (public, filter pending if not admin)
 */
router.get('/products/:productId/comments', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const includePending = req.user?.role === 'admin'
    
    const comments = await commentModel.getProductComments(productId, includePending)
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/comments/:id
 * Update comment (protected, own comment or admin)
 */
router.put(
  '/comments/:id',
  protect,
  [
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const commentId = parseInt(req.params.id)
      const userId = req.user.id
      const isAdmin = req.user.role === 'admin'
      const comment = req.body.comment

      const updatedComment = await commentModel.updateComment(commentId, userId, comment, isAdmin)
      if (!updatedComment) {
        return res.status(404).json({ message: 'Comment not found' })
      }
      res.json(updatedComment)
    } catch (error) {
      if (error.message === 'Unauthorized to update this comment') {
        return res.status(403).json({ message: error.message })
      }
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * DELETE /api/comments/:id
 * Delete comment (protected, own comment or admin)
 */
router.delete('/comments/:id', protect, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id)
    const userId = req.user.id
    const isAdmin = req.user.role === 'admin'

    const deleted = await commentModel.deleteComment(commentId, userId, isAdmin)
    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    res.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    if (error.message === 'Unauthorized to delete this comment') {
      return res.status(403).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/comments/:id/approve
 * Approve comment (admin only)
 */
router.post('/comments/:id/approve', protect, admin, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id)
    const approved = await commentModel.approveComment(commentId)
    
    if (!approved) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    res.json({ message: 'Comment approved successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/comments/:id/reject
 * Reject comment (admin only)
 */
router.post('/comments/:id/reject', protect, admin, async (req, res) => {
  try {
    const commentId = parseInt(req.params.id)
    const rejected = await commentModel.rejectComment(commentId)
    
    if (!rejected) {
      return res.status(404).json({ message: 'Comment not found' })
    }
    res.json({ message: 'Comment rejected successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/comments/pending
 * Get pending comments (admin only)
 */
router.get('/comments/pending', protect, admin, async (req, res) => {
  try {
    const comments = await commentModel.getPendingComments()
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

