/**
 * Invoice Routes
 * Handles all invoice-related API endpoints
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import type { Request, Response, NextFunction } from "express";
import express from 'express'
import * as invoiceModel from '../models/invoiceModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { generateInvoicePDF } from '../utils/pdfService.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

/**
 * GET /api/invoices
 * Get user's invoices
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const orderId = Number(req.query.order_id)
    if (Number.isInteger(orderId) && orderId > 0) {
      const invoice = await invoiceModel.getInvoiceByOrderId(orderId)
      if (!invoice || Number(invoice.user_id) !== Number(req.user!.id)) {
        return res.json({ invoices: [], pagination: { page: 1, limit: 1, total: 0, pages: 0 } })
      }
      return res.json({
        invoices: [invoice],
        pagination: { page: 1, limit: 1, total: 1, pages: 1 },
      })
    }

    const page = parseInt(String(req.query.page)) || 1
    const result = await invoiceModel.getUserInvoices(req.user!.id, { page })
    res.json(result)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/invoices/:id/download
 * Download invoice as PDF
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/:id/download', protect, async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceModel.getInvoiceById(parseInt(req.params.id), req.user!.id)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../../temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    // Generate PDF
    const fileName = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`
    const filePath = path.join(tempDir, fileName)
    await generateInvoicePDF(invoice as any, filePath)

    // Send PDF file
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)

    // Clean up file after sending
    fileStream.on('end', () => {
      setTimeout(() => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      }, 1000)
    })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) || 'Failed to generate PDF' })
  }
})

/**
 * GET /api/invoices/:id
 * Get invoice details
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/:id', protect, async (req: Request, res: Response) => {
  try {
    const invoice = await invoiceModel.getInvoiceById(parseInt(req.params.id), req.user!.id)
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' })
    }
    res.json(invoice)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

export default router

