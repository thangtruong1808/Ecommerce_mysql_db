/**
 * Password Reset Model
 * Handles all database operations related to password reset tokens
 * 
 * @author Thang Truong
 * @date 2025-01-09
 */

import db from '../config/db.js'
import crypto from 'crypto'

/**
 * Create a password reset token
 * @param {number} userId - User ID
 * @param {Date} expiresAt - Token expiration date
 * @returns {Promise<string>} Generated reset token
 */
export const createResetToken = async (userId, expiresAt) => {
  const token = crypto.randomBytes(32).toString('hex')
  
  await db.execute(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  )
  
  return token
}

/**
 * Find reset token by token string
 * @param {string} token - Reset token
 * @returns {Promise<Object|null>} Token record or null
 */
export const findResetToken = async (token) => {
  const [rows] = await db.execute(
    `SELECT prt.*, u.email, u.name 
     FROM password_reset_tokens prt
     JOIN users u ON prt.user_id = u.id
     WHERE prt.token = ? AND prt.used = FALSE AND prt.expires_at > NOW()`,
    [token]
  )
  return rows[0] || null
}

/**
 * Mark reset token as used
 * @param {string} token - Reset token
 * @returns {Promise<boolean>} True if updated, false otherwise
 */
export const markTokenAsUsed = async (token) => {
  const [result] = await db.execute(
    'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
    [token]
  )
  return result.affectedRows > 0
}

/**
 * Delete expired tokens for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Number of deleted tokens
 */
export const deleteExpiredTokens = async (userId) => {
  const [result] = await db.execute(
    'DELETE FROM password_reset_tokens WHERE user_id = ? AND (expires_at <= NOW() OR used = TRUE)',
    [userId]
  )
  return result.affectedRows
}

