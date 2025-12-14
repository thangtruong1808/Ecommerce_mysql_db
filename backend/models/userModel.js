/**
 * User Model
 * Handles all database operations related to users
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Create a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<number>} - Inserted user ID
 */
export const createUser = async (name, email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  )
  return result.insertId
}

/**
 * Find user by email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} - User object or null
 */
export const findUserByEmail = async (email) => {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )
  return rows[0] || null
}

/**
 * Find user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object|null>} - User object or null
 */
export const findUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  )
  return rows[0] || null
}

/**
 * Update user profile
 * @param {number} id - User ID
 * @param {Object} updateData - Data to update (name, email, password)
 * @returns {Promise<Object|null>} - Updated user object or null
 */
export const updateUser = async (id, updateData) => {
  const fields = []
  const values = []

  if (updateData.name) {
    fields.push('name = ?')
    values.push(updateData.name)
  }
  if (updateData.email) {
    fields.push('email = ?')
    values.push(updateData.email)
  }
  if (updateData.password) {
    fields.push('password = ?')
    values.push(updateData.password)
  }

  if (fields.length === 0) return null

  values.push(id)
  const [result] = await db.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null
  return findUserById(id)
}

/**
 * Get all users with pagination, search, and filters (for admin)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} search - Search term
 * @param {string} role - Role filter
 * @returns {Promise<Object>} - Users and pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllUsers = async (page = 1, limit = 10, search = null, role = null, sortBy = 'created_at', sortOrder = 'desc') => {
  const offset = (page - 1) * limit
  const conditions = []
  const params = []
  
  // Allowed sort columns
  const allowedSortColumns = ['id', 'name', 'email', 'role', 'created_at', 'updated_at']
  const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'
  const validSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'
  
  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }
  if (role) {
    conditions.push('role = ?')
    params.push(role)
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitInt = parseInt(limit, 10)
  const offsetInt = parseInt(offset, 10)
  
  const [rows] = await db.execute(
    `SELECT id, name, email, role, created_at, updated_at FROM users ${whereClause} ORDER BY ${validSortBy} ${validSortOrder} LIMIT ${limitInt} OFFSET ${offsetInt}`,
    params
  )

  const [countResult] = await db.execute(`SELECT COUNT(*) as total FROM users ${whereClause}`, params)
  const total = countResult[0].total

  return {
    users: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Update user role (admin only)
 * @param {number} id - User ID
 * @param {string} role - New role ('user' or 'admin')
 * @returns {Promise<Object|null>} - Updated user or null
 */
export const updateUserRole = async (id, role) => {
  const [result] = await db.execute(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, id]
  )

  if (result.affectedRows === 0) return null
  return findUserById(id)
}

