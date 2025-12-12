/**
 * Invoice Routes
 * Handles all invoice-related API endpoints
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as invoiceModel from '../models/invoiceModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * GET /api/invoices
 * Get user's invoices
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const result = await invoiceModel.getUserInvoices(req.user.id, { page })
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/invoices/:id
 * Get invoice details
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const invoice = await invoiceModel.getInvoiceById(parseInt(req.params.id), req.user.id)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    res.json(invoice)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

