/**
 * Refresh Token Model
 * Handles all database operations related to refresh tokens
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Create a new refresh token
 * @param {number} userId - User ID
 * @param {string} token - Refresh token
 * @param {Date} expiresAt - Expiration date
 * @returns {Promise<number>} - Inserted token ID
 */
export const createRefreshToken = async (userId, token, expiresAt) => {
  const [result] = await db.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  )
  return result.insertId
}

/**
 * Find refresh token by token string
 * @param {string} token - Refresh token
 * @returns {Promise<Object|null>} - Token object or null
 */
export const findRefreshToken = async (token) => {
  const [rows] = await db.execute(
    'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
    [token]
  )
  return rows[0] || null
}

/**
 * Delete refresh token
 * @param {string} token - Refresh token to delete
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteRefreshToken = async (token) => {
  const [result] = await db.execute(
    'DELETE FROM refresh_tokens WHERE token = ?',
    [token]
  )
  return result.affectedRows > 0
}

/**
 * Delete all refresh tokens for a user
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteAllUserRefreshTokens = async (userId) => {
  const [result] = await db.execute(
    'DELETE FROM refresh_tokens WHERE user_id = ?',
    [userId]
  )
  return result.affectedRows >= 0
}

/**
 * Clean up expired refresh tokens
 * @returns {Promise<number>} - Number of deleted tokens
 */
export const cleanupExpiredTokens = async () => {
  const [result] = await db.execute(
    'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
  )
  return result.affectedRows
}

/**
 * Delete old refresh token and create new one (token rotation)
 * @param {string} oldToken - Old refresh token
 * @param {number} userId - User ID
 * @param {string} newToken - New refresh token
 * @param {Date} expiresAt - New expiration date
 * @returns {Promise<number>} - New token ID
 */
export const rotateRefreshToken = async (oldToken, userId, newToken, expiresAt) => {
  const connection = await db.getConnection()
  
  try {
    await connection.beginTransaction()

    // Delete old token
    await connection.execute(
      'DELETE FROM refresh_tokens WHERE token = ?',
      [oldToken]
    )

    // Create new token
    const [result] = await connection.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, newToken, expiresAt]
    )

    await connection.commit()
    return result.insertId
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

