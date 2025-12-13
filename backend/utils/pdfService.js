/**
 * PDF Service
 * Handles PDF generation for invoices
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Generate PDF invoice
 * @param {Object} invoice - Invoice data with order items
 * @param {string} outputPath - Path to save PDF file
 * @returns {Promise<string>} - Path to generated PDF file
 * @author Thang Truong
 * @date 2025-12-12
 */
export const generateInvoicePDF = async (invoice, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' })
      const stream = fs.createWriteStream(outputPath)
      doc.pipe(stream)

      // Helper function to format date
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const month = months[date.getMonth()]
        const year = date.getFullYear()
        let hours = date.getHours()
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12 || 12
        return `${day}-${month}-${year}, ${hours}:${minutes} ${ampm}`
      }

      // Format order number
      const formatOrderNumber = () => {
        if (invoice.order_number) return invoice.order_number
        const date = new Date(invoice.created_at)
        const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
        return `ORD-${datePart}-${String(invoice.order_id).padStart(5, '0')}`
      }

      // Helper to get logo path
      const getLogoPath = () => {
        const logoPath = path.join(__dirname, '../../frontend/src/assets/images/Logo.png')
        if (fs.existsSync(logoPath)) return logoPath
        return null
      }

      // Header with logo and description
      const logoPath = getLogoPath()
      let headerY = 50
      let textX = 50
      if (logoPath) {
        try {
          doc.image(logoPath, 50, headerY, { width: 64, height: 64, fit: [64, 64] })
          textX = 130
        } catch (err) {
          // If image fails, continue without logo
        }
      }
      doc.fontSize(24).text('Ecommerce Store', textX, headerY, { align: 'left' })
      doc.fontSize(10).text('Your trusted online shopping destination. Quality products, exceptional service, and fast delivery.', textX, headerY + 25, { width: 300 })
      
      // Invoice title
      doc.fontSize(20).text('INVOICE', 50, headerY + 60, { align: 'left' })
      
      // Invoice details (right side)
      doc.fontSize(10)
      doc.text(`Invoice Number: ${invoice.invoice_number}`, 350, headerY + 60, { align: 'right' })
      doc.text(`Date: ${formatDate(invoice.created_at)}`, 350, headerY + 75, { align: 'right' })
      doc.text(`Order: ${formatOrderNumber()}`, 350, headerY + 90, { align: 'right' })

      // Billing and Shipping addresses
      const billingAddr = typeof invoice.billing_address === 'object' ? invoice.billing_address : JSON.parse(invoice.billing_address || '{}')
      const shippingAddr = typeof invoice.shipping_address === 'object' ? invoice.shipping_address : JSON.parse(invoice.shipping_address || '{}')
      
      let yPos = headerY + 140
      doc.fontSize(12).font('Helvetica-Bold').text('Billing Address', 50, yPos)
      doc.font('Helvetica').fontSize(10)
      doc.text(billingAddr.address || '', 50, yPos + 15)
      doc.text(`${billingAddr.city || ''}, ${billingAddr.postal_code || ''}`, 50, yPos + 30)
      doc.text(billingAddr.country || '', 50, yPos + 45)
      
      doc.font('Helvetica-Bold').text('Shipping Address', 300, yPos)
      doc.font('Helvetica')
      doc.text(shippingAddr.address || '', 300, yPos + 15)
      doc.text(`${shippingAddr.city || ''}, ${shippingAddr.postal_code || ''}`, 300, yPos + 30)
      doc.text(shippingAddr.country || '', 300, yPos + 45)

      // Order items table
      yPos = yPos + 80
      doc.font('Helvetica-Bold').fontSize(12).text('Items', 50, yPos)
      yPos += 25
      
      // Table header
      doc.font('Helvetica-Bold').fontSize(10)
      doc.text('Item', 50, yPos)
      doc.text('Quantity', 300, yPos)
      doc.text('Price', 400, yPos)
      doc.text('Total', 480, yPos)
      yPos += 15
      doc.moveTo(50, yPos).lineTo(550, yPos).stroke()
      yPos += 10

      // Order items
      if (invoice.items && invoice.items.length > 0) {
        doc.font('Helvetica').fontSize(10)
        invoice.items.forEach((item) => {
          const itemTotal = (Number(item.price) || 0) * item.quantity
          doc.text(item.name || 'N/A', 50, yPos, { width: 240 })
          doc.text(String(item.quantity), 300, yPos)
          doc.text(`$${(Number(item.price) || 0).toFixed(2)}`, 400, yPos)
          doc.text(`$${itemTotal.toFixed(2)}`, 480, yPos)
          yPos += 20
        })
      }

      // Totals
      yPos += 10
      doc.moveTo(50, yPos).lineTo(550, yPos).stroke()
      yPos += 15
      doc.font('Helvetica').fontSize(10)
      doc.text('Subtotal:', 400, yPos)
      doc.text(`$${parseFloat(invoice.subtotal || 0).toFixed(2)}`, 480, yPos)
      yPos += 15
      doc.text('Tax:', 400, yPos)
      doc.text(`$${parseFloat(invoice.tax_amount || 0).toFixed(2)}`, 480, yPos)
      yPos += 15
      doc.text('Shipping:', 400, yPos)
      doc.text(`$${parseFloat(invoice.shipping_amount || 0).toFixed(2)}`, 480, yPos)
      yPos += 15
      doc.moveTo(400, yPos).lineTo(550, yPos).stroke()
      yPos += 15
      doc.font('Helvetica-Bold').fontSize(12)
      doc.text('Total:', 400, yPos)
      doc.text(`$${parseFloat(invoice.total_amount || 0).toFixed(2)}`, 480, yPos)

      // Payment info
      yPos += 40
      doc.font('Helvetica').fontSize(10)
      doc.text(`Payment Method: ${invoice.payment_method || 'N/A'}`, 50, yPos)
      yPos += 15
      doc.text(`Payment Status: ${invoice.payment_status || 'N/A'}`, 50, yPos)

      // Footer - position after content with spacing, but ensure it's on first page if there's space
      const pageHeight = doc.page.height
      const bottomMargin = 50
      const footerSpacing = 30
      const footerY = (yPos + footerSpacing < pageHeight - bottomMargin) ? yPos + footerSpacing : pageHeight - bottomMargin
      doc.fontSize(8).text(`© ${new Date().getFullYear()} Ecommerce Store. All rights reserved.`, 50, footerY, { align: 'center', width: 500 })

      doc.end()
      stream.on('finish', () => resolve(outputPath))
      stream.on('error', reject)
    } catch (error) {
      reject(error)
    }
  })
}
