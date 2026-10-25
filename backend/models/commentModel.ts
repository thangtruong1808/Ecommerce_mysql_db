import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type * as Rows from "../types/domain.js";
/**
 * Comment Model
 * Handles all database operations related to product comments
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Create a new comment
 * @param {number} productId - Product ID
 * @param {number} userId - User ID
 * @param {string} comment - Comment text
 * @returns {Promise<number>} - Created comment ID
 */
export const createComment = async (productId: number, userId: number, comment: string) => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO product_comments (product_id, user_id, comment, is_approved) VALUES (?, ?, ?, ?)',
    [productId, userId, comment, true]
  )
  return result.insertId
}

/**
 * Get comments for a product
 * @param {number} productId - Product ID
 * @param {boolean} includePending - Include pending comments (for admins)
 * @returns {Promise<Array>} - Array of comments
 */
export const getProductComments = async (productId: number, includePending: boolean = false) => {
  let query = `SELECT c.*, 
                      u.name as user_name,
                      u.email as user_email
               FROM product_comments c
               JOIN users u ON c.user_id = u.id
               WHERE c.product_id = ?`
  
  const params: any[] = [productId]
  
  if (!includePending) {
    query += ' AND c.is_approved = ?'
    params.push(true)
  }
  
  query += ' ORDER BY c.created_at DESC'
  
  const [rows] = await db.execute<RowDataPacket[]>(query, params)
  return rows
}

/**
 * Get comment by ID
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object|null>} - Comment object or null
 */
export const getCommentById = async (commentId: number) => {
  const [rows] = await db.execute<Rows.CommentRow[]>(
    `SELECT c.*, 
            u.name as user_name,
            p.name as product_name
     FROM product_comments c
     JOIN users u ON c.user_id = u.id
     JOIN products p ON c.product_id = p.id
     WHERE c.id = ?`,
    [commentId]
  )
  return rows[0] || null
}

/**
 * Update comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for authorization)
 * @param {string} comment - New comment text
 * @param {boolean} isAdmin - Whether user is admin
 * @returns {Promise<Object|null>} - Updated comment or null
 */
export const updateComment = async (commentId: number, userId: number, comment: string, isAdmin: boolean = false) => {
  // Check if user owns the comment or is admin
  const existingComment = await getCommentById(commentId)
  if (!existingComment) return null
  
  if (!isAdmin && existingComment.user_id !== userId) {
    throw new Error('Unauthorized to update this comment')
  }
  
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE product_comments SET comment = ? WHERE id = ?',
    [comment, commentId]
  )
  
  if (result.affectedRows === 0) return null
  return getCommentById(commentId)
}

/**
 * Delete comment
 * @param {number} commentId - Comment ID
 * @param {number} userId - User ID (for authorization)
 * @param {boolean} isAdmin - Whether user is admin
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteComment = async (commentId: number, userId: number, isAdmin: boolean = false) => {
  // Check if user owns the comment or is admin
  const existingComment = await getCommentById(commentId)
  if (!existingComment) return false
  
  if (!isAdmin && existingComment.user_id !== userId) {
    throw new Error('Unauthorized to delete this comment')
  }
  
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM product_comments WHERE id = ?',
    [commentId]
  )
  return result.affectedRows > 0
}

/**
 * Approve comment (admin only)
 * @param {number} commentId - Comment ID
 * @returns {Promise<boolean>} - True if approved, false otherwise
 */
export const approveComment = async (commentId: number) => {
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE product_comments SET is_approved = ? WHERE id = ?',
    [true, commentId]
  )
  return result.affectedRows > 0
}

/**
 * Reject comment (admin only)
 * @param {number} commentId - Comment ID
 * @returns {Promise<boolean>} - True if rejected, false otherwise
 */
export const rejectComment = async (commentId: number) => {
  const [result] = await db.execute<ResultSetHeader>(
    'UPDATE product_comments SET is_approved = ? WHERE id = ?',
    [false, commentId]
  )
  return result.affectedRows > 0
}

/**
 * Get pending comments (for admin moderation)
 * @returns {Promise<Array>} - Array of pending comments
 */
export const getPendingComments = async () => {
  const [rows] = await db.execute<Rows.CommentRow[]>(
    `SELECT c.*, 
            u.name as user_name,
            u.email as user_email,
            p.name as product_name
     FROM product_comments c
     JOIN users u ON c.user_id = u.id
     JOIN products p ON c.product_id = p.id
     WHERE c.is_approved = ?
     ORDER BY c.created_at DESC`,
    [false]
  )
  return rows
}

/**
 * Get user's comment for a product
 * @param {number} userId - User ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object|null>} - Comment object or null
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getUserComment = async (userId: number, productId: number) => {
  const [rows] = await db.execute<Rows.CommentRow[]>(
    `SELECT c.*, 
            u.name as user_name,
            u.email as user_email
     FROM product_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.user_id = ? AND c.product_id = ? AND c.is_approved = 1
     ORDER BY c.created_at DESC
     LIMIT 1`,
    [userId, productId]
  )
  return rows[0] || null
}

/**
 * Get all comments with pagination and filters (admin only)
 * @param {Object} filters - Filter options (page, limit, search, productId, userId, isApproved, sortBy, sortOrder)
 * @returns {Promise<Object>} - Comments with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllCommentsPaginated = async (filters: Rows.ListQuery = {}) => {
  try {
    const page = parseInt(String(filters.page)) || 1
    const limit = parseInt(String(filters.limit)) || 20
    const offset = (page - 1) * limit
    const search = filters.search ? String(filters.search).trim() : ''
    const productId = filters.productId ? parseInt(String(filters.productId)) : null
    const userId = filters.userId ? parseInt(String(filters.userId)) : null
    const isApproved = filters.isApproved !== undefined ? filters.isApproved : null
    const sortBy = filters.sortBy || 'created_at'
    const sortOrder = filters.sortOrder || 'desc'
    
    // Allowed sort columns
    const allowedSortColumns = ['id', 'product_id', 'user_id', 'comment', 'is_approved', 'product_name', 'user_name', 'created_at', 'updated_at']
    const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'
    const validSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'
    
    let query = `
      SELECT c.*, 
             u.name as user_name,
             u.email as user_email,
             p.name as product_name
      FROM product_comments c
      JOIN users u ON c.user_id = u.id
      JOIN products p ON c.product_id = p.id
    `
    const params: any[] = []
    
    const conditions: string[] = []
    if (productId && !isNaN(productId)) {
      conditions.push('c.product_id = ?')
      params.push(productId)
    }
    if (userId && !isNaN(userId)) {
      conditions.push('c.user_id = ?')
      params.push(userId)
    }
    if (isApproved !== null) {
      conditions.push('c.is_approved = ?')
      params.push(isApproved ? 1 : 0)
    }
    if (search) {
      // Sanitize search string and escape special LIKE characters (% _ \)
      // Must escape backslashes first, then other special characters
      const sanitizedSearch = String(search).trim()
        .replace(/\\/g, '\\\\')  // Escape backslashes first
        .replace(/%/g, '\\%')    // Escape percent signs
        .replace(/_/g, '\\_')    // Escape underscores
      const searchPattern = `%${sanitizedSearch}%`
      conditions.push('(u.name LIKE ? OR u.email LIKE ? OR p.name LIKE ? OR c.comment LIKE ?)')
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    // Map sort column to actual table column
    let sortColumn = `c.${validSortBy}`
    if (validSortBy === 'product_name') sortColumn = 'p.name'
    else if (validSortBy === 'user_name') sortColumn = 'u.name'
    
    // Get total count - build count query before adding ORDER BY and LIMIT
    // Use a simpler approach: build count query from base query structure
    let countQuery = `
      SELECT COUNT(*) as total
      FROM product_comments c
      JOIN users u ON c.user_id = u.id
      JOIN products p ON c.product_id = p.id
    `
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ')
    }
    const [countResult] = await db.execute<Rows.CountRow[]>(countQuery, params)
    // Ensure total is a number - MySQL returns COUNT as BigInt, convert to number
    const total = Number(countResult[0]?.total) || 0

    // Add sorting and pagination to main query
    query += ` ORDER BY ${sortColumn} ${validSortOrder}`
    const limitInt = Math.floor(Number(limit))
    const offsetInt = Math.floor(Number(offset))
    query += ` LIMIT ${limitInt} OFFSET ${offsetInt}`

    const [rows] = await db.execute<RowDataPacket[]>(query, params)

    return {
      comments: rows || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    }
  } catch (error: unknown) {
    // Return empty result with default pagination on any error
    const page = parseInt(String(filters.page)) || 1
    const limit = parseInt(String(filters.limit)) || 20
    return {
      comments: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 1
      }
    }
  }
}

