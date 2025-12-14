/**
 * Child Category Model
 * Handles all database operations related to child categories (3rd level)
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Get all child categories
 * @returns {Promise<Array>} - Array of child category objects with subcategory info
 */
export const getAllChildCategories = async () => {
  const [rows] = await db.execute(
    `SELECT cc.*, s.name as subcategory_name, s.id as subcategory_id,
            c.name as category_name, c.id as category_id
     FROM child_categories cc
     JOIN subcategories s ON cc.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     ORDER BY c.name, s.name, cc.name ASC`
  )
  return rows
}

/**
 * Get all child categories with pagination and filters
 * @param {Object} filters - Filter options (page, limit, search, subcategoryId)
 * @returns {Promise<Object>} - Child categories with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllChildCategoriesPaginated = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  const search = filters.search || ''
  const subcategoryId = filters.subcategoryId ? parseInt(filters.subcategoryId) : null
  
  let query = `
    SELECT cc.*, s.name as subcategory_name, s.id as subcategory_id,
            c.name as category_name, c.id as category_id
    FROM child_categories cc
    JOIN subcategories s ON cc.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
  `
  const params = []
  
  const conditions = []
  if (subcategoryId && !isNaN(subcategoryId)) {
    conditions.push('cc.subcategory_id = ?')
    params.push(subcategoryId)
  }
  if (search) {
    conditions.push('(cc.name LIKE ? OR cc.description LIKE ? OR s.name LIKE ? OR c.name LIKE ?)')
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern, searchPattern)
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  
  query += ' ORDER BY c.name, s.name, cc.name ASC'
  
  // Get total count
  const countQuery = query.replace(
    'SELECT cc.*, s.name as subcategory_name, s.id as subcategory_id, c.name as category_name, c.id as category_id',
    'SELECT COUNT(*) as total'
  )
  const [countResult] = await db.execute(countQuery, params)
  const total = countResult[0].total
  
  // Get paginated results
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute(query, params)
  
  return {
    childCategories: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get child categories by subcategory ID
 * @param {number} subcategoryId - Subcategory ID
 * @returns {Promise<Array>} - Array of child category objects
 */
export const getChildCategoriesBySubcategory = async (subcategoryId) => {
  const [rows] = await db.execute(
    'SELECT * FROM child_categories WHERE subcategory_id = ? ORDER BY name ASC',
    [subcategoryId]
  )
  return rows
}

/**
 * Get child category by ID with full hierarchy info
 * @param {number} id - Child category ID
 * @returns {Promise<Object|null>} - Child category object or null
 */
export const getChildCategoryById = async (id) => {
  const [rows] = await db.execute(
    `SELECT cc.*, s.name as subcategory_name, s.id as subcategory_id,
            c.name as category_name, c.id as category_id
     FROM child_categories cc
     JOIN subcategories s ON cc.subcategory_id = s.id
     JOIN categories c ON s.category_id = c.id
     WHERE cc.id = ?`,
    [id]
  )
  return rows[0] || null
}

/**
 * Create a new child category
 * @param {number} subcategoryId - Subcategory ID
 * @param {string} name - Child category name
 * @param {string} description - Child category description
 * @returns {Promise<number>} - Inserted child category ID
 */
export const createChildCategory = async (subcategoryId, name, description = null) => {
  const [result] = await db.execute(
    'INSERT INTO child_categories (subcategory_id, name, description) VALUES (?, ?, ?)',
    [subcategoryId, name, description]
  )
  return result.insertId
}

/**
 * Update child category
 * @param {number} id - Child category ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated child category or null
 */
export const updateChildCategory = async (id, updateData) => {
  const fields = []
  const values = []

  if (updateData.subcategory_id) {
    fields.push('subcategory_id = ?')
    values.push(updateData.subcategory_id)
  }
  if (updateData.name) {
    fields.push('name = ?')
    values.push(updateData.name)
  }
  if (updateData.description !== undefined) {
    fields.push('description = ?')
    values.push(updateData.description)
  }

  if (fields.length === 0) return null

  values.push(id)
  const [result] = await db.execute(
    `UPDATE child_categories SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null
  return getChildCategoryById(id)
}

/**
 * Delete child category
 * @param {number} id - Child category ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteChildCategory = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM child_categories WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

