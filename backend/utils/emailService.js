/**
 * Email Service
 * Handles sending emails using Nodemailer
 * 
 * @author Thang Truong
 * @date 2025-01-09
 */

import nodemailer from 'nodemailer'

/**
 * Create email transporter
 * @returns {Object|null} Nodemailer transporter or null if config is missing
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
export const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const transporter = createTransporter()
  
  if (!transporter) {
    const errorMsg = 'Email service not configured. Please configure SMTP settings in environment variables.'
    console.error(errorMsg)
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

