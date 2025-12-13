/**
 * Email Service
 * Handles sending emails using Nodemailer
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import nodemailer from 'nodemailer'

/**
 * Create email transporter
 * @returns {Object|null} Nodemailer transporter or null if config is missing
 * @author Thang Truong
 * @date 2025-12-12
 */
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  
  // Check if SMTP credentials are configured
  if (!smtpUser || !smtpPass || smtpUser === 'your-email@gmail.com' || !smtpPass.trim()) {
    return null
  }

  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  } catch (error) {
    return null
  }
}

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name
 * @returns {Promise<Object>} Email send result
 */
/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name
 * @returns {Promise<Object>} Email send result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const transporter = createTransporter()
  
  if (!transporter) {
    const errorMsg = 'Email service not configured. Please configure SMTP settings in environment variables.'
    throw new Error(errorMsg)
  }

  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Ecommerce Store'}" <${process.env.EMAIL_FROM || 'noreply@ecommerce.com'}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    throw new Error(`Failed to send password reset email: ${error.message || 'Unknown error'}`)
  }
}

/**
 * Send invoice email to buyer
 * @param {string} email - Buyer email
 * @param {string} userName - Buyer name
 * @param {Object} invoice - Invoice data
 * @returns {Promise<Object>} Email send result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const sendInvoiceEmail = async (email, userName, invoice) => {
  const transporter = createTransporter()
  
  if (!transporter) {
    // Don't throw error - email sending is optional, just log silently
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const invoiceUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invoices/${invoice.id}`
    // Logo URL - can be configured via EMAIL_LOGO_URL env var, or use frontend URL
    const logoUrl = process.env.EMAIL_LOGO_URL || `${process.env.FRONTEND_URL || 'http://localhost:3000'}/Logo.png`
    const billingAddress = typeof invoice.billing_address === 'object' 
      ? invoice.billing_address 
      : JSON.parse(invoice.billing_address || '{}')
    const shippingAddress = typeof invoice.shipping_address === 'object'
      ? invoice.shipping_address
      : JSON.parse(invoice.shipping_address || '{}')
    
    /**
     * Format date to dd-MMM-yyyy, hh:mm AM/PM format (e.g., 13-Dec-2025, 2:30 PM)
     * @param {string} dateString - Date string
     * @returns {string} Formatted date with time in 12-hour format
     * @author Thang Truong
     * @date 2025-12-12
     */
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
    
    /**
     * Format order number for display
     * @param {Object} invoice - Invoice object with order_id
     * @returns {string} Formatted order number
     * @author Thang Truong
     * @date 2025-12-12
     */
    const formatOrderNumber = () => {
      if (invoice.order_number) {
        return invoice.order_number
      }
      // Fallback for existing orders without order_number
      const date = new Date(invoice.created_at)
      const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
      return `ORD-${datePart}-${String(invoice.order_id).padStart(5, '0')}`
    }
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Ecommerce Store'}" <${process.env.EMAIL_FROM || 'noreply@ecommerce.com'}>`,
      to: email,
      subject: `Invoice ${invoice.invoice_number} - Order Confirmation`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Brand section with logo and description -->
          <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
              <img src="${logoUrl}" alt="Ecommerce Store Logo" style="height: 64px; width: auto; object-fit: contain;" />
              <div>
                <h2 style="color: #111827; font-size: 24px; font-weight: bold; margin: 0;">Ecommerce Store</h2>
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0 0 0;">
                  Your trusted online shopping destination. Quality products, exceptional service, and fast delivery.
                </p>
              </div>
            </div>
          </div>

          <h2 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">Order Confirmation</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${userName},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for your purchase! Your order has been confirmed and your invoice is ready.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Invoice Number:</strong> ${invoice.invoice_number}</p>
            <p style="margin: 5px 0;"><strong>Order Number:</strong> ${formatOrderNumber()}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(invoice.created_at)}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${parseFloat(invoice.total_amount).toFixed(2)}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333; font-size: 16px;">Billing Address</h3>
            <p style="color: #666; margin: 5px 0;">
              ${billingAddress.address || ''}<br />
              ${billingAddress.city || ''}, ${billingAddress.postal_code || ''}<br />
              ${billingAddress.country || ''}
            </p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333; font-size: 16px;">Shipping Address</h3>
            <p style="color: #666; margin: 5px 0;">
              ${shippingAddress.address || ''}<br />
              ${shippingAddress.city || ''}, ${shippingAddress.postal_code || ''}<br />
              ${shippingAddress.country || ''}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${invoiceUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Invoice</a>
          </div>

          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #1e40af; font-size: 16px; font-weight: bold; margin: 0 0 10px 0;">Estimated Delivery</h3>
            <p style="color: #1e3a8a; font-size: 14px; margin: 0; line-height: 1.6;">
              Your order will be delivered within <strong>3-5 business days</strong> from the date of shipment. We will integrate shipping tracking with our provider soon, and you'll receive tracking information via email once your order ships.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px; line-height: 1.6;">
            If you have any questions about your order, please contact our support team. We're here to help!
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 20px; line-height: 1.5;">
            This is an automated email. Please do not reply to this message.
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Ecommerce Store. All rights reserved.
            </p>
          </div>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    return { success: false, message: `Failed to send invoice email: ${error.message || 'Unknown error'}` }
  }
}
