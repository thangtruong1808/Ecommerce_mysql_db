/**
 * Authentication Routes
 * Handles user registration, login, logout, and token refresh
 * Uses HTTP-only cookies for token storage
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import * as userModel from '../models/userModel.js'
import * as refreshTokenModel from '../models/refreshTokenModel.js'
import * as passwordResetModel from '../models/passwordResetModel.js'
import { protect } from '../middleware/authMiddleware.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpiration } from '../utils/tokenUtils.js'
import { setAccessTokenCookie, setRefreshTokenCookie, clearAllTokenCookies } from '../utils/cookieUtils.js'
import { sendPasswordResetEmail } from '../utils/emailService.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      const userExists = await userModel.findUserByEmail(email)

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const userId = await userModel.createUser(name, email, hashedPassword)
      const user = await userModel.findUserById(userId)

      // Generate tokens
      const accessToken = generateAccessToken(user.id)
      const refreshToken = generateRefreshToken(user.id)

      // Store refresh token in database
      const expiresAt = getTokenExpiration(refreshToken)
      await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt)

      // Set tokens as HTTP-only cookies
      setAccessTokenCookie(res, accessToken)
      setRefreshTokenCookie(res, refreshToken)

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * POST /api/auth/login
 * Login user and generate tokens
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const user = await userModel.findUserByEmail(email)

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
          // Generate tokens
          const accessToken = generateAccessToken(user.id)
          const refreshToken = generateRefreshToken(user.id)

          // Store refresh token in database
          const expiresAt = getTokenExpiration(refreshToken)
          await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt)

          // Set tokens as HTTP-only cookies
          setAccessTokenCookie(res, accessToken)
          setRefreshTokenCookie(res, refreshToken)

          res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          })
        } else {
          res.status(401).json({ message: 'Invalid email or password' })
        }
      } else {
        res.status(401).json({ message: 'Invalid email or password' })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' })
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    // Check if token exists in database
    const tokenRecord = await refreshTokenModel.findRefreshToken(refreshToken)
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Refresh token not found or expired' })
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.id)

    // Set new access token cookie
    setAccessTokenCookie(res, newAccessToken)

    res.json({ message: 'Token refreshed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/auth/logout
 * Logout user and invalidate refresh token
 */
router.post('/logout', protect, async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      // Delete refresh token from database
      await refreshTokenModel.deleteRefreshToken(refreshToken)
    }

    // Clear both token cookies
    clearAllTokenCookies(res)

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please include a valid email'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const updateData = {}
      if (req.body.name) updateData.name = req.body.name
      if (req.body.email) updateData.email = req.body.email
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        updateData.password = await bcrypt.hash(req.body.password, salt)
      }

      const updatedUser = await userModel.updateUser(req.user.id, updateData)

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      
      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
)

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Please include a valid email')],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { email } = req.body
      const user = await userModel.findUserByEmail(email)

      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: 'If that email exists, a password reset link has been sent.' })
      }

      // Delete expired tokens for this user
      await passwordResetModel.deleteExpiredTokens(user.id)

      // Create reset token (expires in 1 hour)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1)
      const resetToken = await passwordResetModel.createResetToken(user.id, expiresAt)

      // Send reset email
      try {
        await sendPasswordResetEmail(user.email, resetToken, user.name)
        console.log(`Password reset email sent to: ${user.email}`)
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError.message || emailError)
        // Log the reset token for manual use if email fails (development only)
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEV] Password reset token for ${user.email}: ${resetToken}`)
          console.log(`[DEV] Reset URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`)
        }
        // Still return success to prevent email enumeration
      }

      res.json({ message: 'If that email exists, a password reset link has been sent.' })
    } catch (error) {
      console.error('Password reset request error:', error.message || error)
      // Always return success to prevent email enumeration, even on errors
      res.json({ message: 'If that email exists, a password reset link has been sent.' })
    }
  }
)

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { token, password } = req.body

      // Find valid token
      const tokenRecord = await passwordResetModel.findResetToken(token)
      if (!tokenRecord) {
        return res.status(400).json({ message: 'Invalid or expired reset token' })
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Update user password
      await userModel.updateUser(tokenRecord.user_id, { password: hashedPassword })

      // Mark token as used
      await passwordResetModel.markTokenAsUsed(token)

      res.json({ message: 'Password has been reset successfully' })
    } catch (error) {
      console.error('Password reset error:', error)
      res.status(500).json({ message: 'Server error. Please try again later.' })
    }
  }
)

export default router
