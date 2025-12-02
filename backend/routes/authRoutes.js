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
import { protect } from '../middleware/authMiddleware.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getTokenExpiration } from '../utils/tokenUtils.js'
import { setAccessTokenCookie, setRefreshTokenCookie, clearAllTokenCookies } from '../utils/cookieUtils.js'

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

export default router
