/**
 * Token Utilities
 * Helper functions for JWT token generation and validation
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production'
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m'
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d'

/**
 * Generate access token
 * @param {number} userId - User ID
 * @returns {string} - JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId, type: 'access' }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
}

/**
 * Generate refresh token
 * @param {number} userId - User ID
 * @returns {string} - JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: 'refresh' }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })
}

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token or null
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.type !== 'access') {
      return null
    }
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Verify refresh token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token or null
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    if (decoded.type !== 'refresh') {
      return null
    }
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Get token expiration date
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token)
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000)
    }
    return null
  } catch (error) {
    return null
  }
}

