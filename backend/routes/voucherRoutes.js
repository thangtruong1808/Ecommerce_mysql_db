/**
 * Voucher Routes
 * Handles all voucher related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import { body, validationResult } from 'express-validator'
import * as voucherModel from '../models/voucherModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * POST /api/vouchers
 * Create voucher (admin only)
 */
router.post(
  '/vouchers',
  protect,
  admin,
  [
    body('code').trim().notEmpty().withMessage('Voucher code is required'),
    body('discount_type').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discount_value').isFloat({ min: 0 }).withMessage('Discount value must be positive'),
    body('start_date').isISO8601().withMessage('Valid start date is required'),
    body('end_date').isISO8601().withMessage('Valid end date is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const voucherId = await voucherModel.createVoucher(req.body)
      const voucher = await voucherModel.getVoucherById(voucherId)
      res.status(201).json(voucher)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Voucher code already exists' })
      }
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * GET /api/vouchers
 * Get active vouchers (public)
 */
router.get('/vouchers', async (req, res) => {
  try {
    const vouchers = await voucherModel.getActiveVouchers()
    res.json(vouchers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/vouchers/admin/all
 * Get all vouchers with pagination (admin only)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/vouchers/admin/all', protect, admin, async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20
    }
    const result = await voucherModel.getAllVouchers(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      vouchers: [],
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        total: 0,
        pages: 0
      }
    })
  }
})

/**
 * GET /api/vouchers/:id
 * Get voucher details (public)
 */
router.get('/vouchers/:id', async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id)
    const voucher = await voucherModel.getVoucherById(voucherId)
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' })
    }
    res.json(voucher)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/vouchers/validate
 * Validate voucher code (protected, for checkout)
 */
router.post(
  '/vouchers/validate',
  protect,
  [
    body('code').trim().notEmpty().withMessage('Voucher code is required'),
    body('order_total').isFloat({ min: 0 }).withMessage('Order total must be positive'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { code, order_total } = req.body
      const userId = req.user.id

      const validation = await voucherModel.validateVoucher(code, userId, order_total)
      
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error })
      }

      // Calculate discount amount
      let discountAmount = 0
      if (validation.voucher.discount_type === 'percentage') {
        discountAmount = (order_total * validation.voucher.discount_value) / 100
        if (validation.voucher.max_discount_amount) {
          discountAmount = Math.min(discountAmount, validation.voucher.max_discount_amount)
        }
      } else {
        discountAmount = validation.voucher.discount_value
      }

      res.json({
        valid: true,
        voucher: validation.voucher,
        discount_amount: discountAmount
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * PUT /api/vouchers/:id
 * Update voucher (admin only)
 */
router.put(
  '/vouchers/:id',
  protect,
  admin,
  [
    body('discount_type').optional().isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discount_value').optional().isFloat({ min: 0 }).withMessage('Discount value must be positive'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const voucherId = parseInt(req.params.id)
      const updatedVoucher = await voucherModel.updateVoucher(voucherId, req.body)
      
      if (!updatedVoucher) {
        return res.status(404).json({ message: 'Voucher not found' })
      }
      res.json(updatedVoucher)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * DELETE /api/vouchers/:id
 * Delete voucher (admin only)
 */
router.delete('/vouchers/:id', protect, admin, async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id)
    const deleted = await voucherModel.deleteVoucher(voucherId)
    
    if (!deleted) {
      return res.status(404).json({ message: 'Voucher not found' })
    }
    res.json({ message: 'Voucher deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

