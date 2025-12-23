/**
 * Subcategory Model
 * Handles all database operations related to subcategories
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Get all subcategories
 * @returns {Promise<Array>} - Array of subcategory objects with category info
 */
export const getAllSubcategories = async () => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name 
     FROM subcategories s
     JOIN categories c ON s.category_id = c.id
     ORDER BY c.name, s.name ASC`
  )
  return rows
}

/**
 * Get all subcategories with pagination and filters
 * @param {Object} filters - Filter options (page, limit, search, categoryId, sortBy, sortOrder)
 * @returns {Promise<Object>} - Subcategories with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllSubcategoriesPaginated = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  const search = filters.search || ''
  const categoryId = filters.categoryId ? parseInt(filters.categoryId) : null
  const sortBy = filters.sortBy || 'name'
  const sortOrder = filters.sortOrder || 'asc'
  
  // Allowed sort columns (can sort by subcategory or category fields)
  const allowedSortColumns = ['id', 'name', 'description', 'category_id', 'category_name', 'created_at', 'updated_at']
  const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'name'
  const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
  
  let query = `
    SELECT s.*, c.name as category_name 
    FROM subcategories s
    JOIN categories c ON s.category_id = c.id
  `
  const params = []
  
  const conditions = []
  if (categoryId && !isNaN(categoryId)) {
    conditions.push('s.category_id = ?')
    params.push(categoryId)
  }
  if (search) {
    conditions.push('(s.name LIKE ? OR s.description LIKE ? OR c.name LIKE ?)')
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern, searchPattern)
  }
  
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ')
  }
  
  // Handle sorting - map category_name to c.name for sorting
  const sortColumn = validSortBy === 'category_name' ? 'c.name' : `s.${validSortBy}`
  query += ` ORDER BY ${sortColumn} ${validSortOrder}`
  
  // Get total count
  const countQuery = query.replace('SELECT s.*, c.name as category_name', 'SELECT COUNT(*) as total')
  const [countResult] = await db.execute(countQuery, params)
  const total = countResult[0].total
  
  // Get paginated results
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute(query, params)
  
  return {
    subcategories: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get subcategories by category ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<Array>} - Array of subcategory objects
 */
export const getSubcategoriesByCategory = async (categoryId) => {
  const [rows] = await db.execute(
    'SELECT * FROM subcategories WHERE category_id = ? ORDER BY name ASC',
    [categoryId]
  )
  return rows
}

/**
 * Get subcategory by ID with category info
 * @param {number} id - Subcategory ID
 * @returns {Promise<Object|null>} - Subcategory object or null
 */
export const getSubcategoryById = async (id) => {
  const [rows] = await db.execute(
    `SELECT s.*, c.name as category_name, c.id as category_id
     FROM subcategories s
     JOIN categories c ON s.category_id = c.id
     WHERE s.id = ?`,
    [id]
  )
  return rows[0] || null
}

/**
 * Create a new subcategory
 * @param {number} categoryId - Category ID
 * @param {string} name - Subcategory name
 * @param {string} description - Subcategory description
 * @param {string} photo_url - Subcategory photo URL
 * @returns {Promise<number>} - Inserted subcategory ID
 * @author Thang Truong
 * @date 2025-01-28
 */
export const createSubcategory = async (categoryId, name, description = null, photo_url = null) => {
  const [result] = await db.execute(
    'INSERT INTO subcategories (category_id, name, description, photo_url) VALUES (?, ?, ?, ?)',
    [categoryId, name, description, photo_url]
  )
  return result.insertId
}

/**
 * Update subcategory
 * @param {number} id - Subcategory ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated subcategory or null
 */
export const updateSubcategory = async (id, updateData) => {
  const fields = []
  const values = []

  if (updateData.category_id) {
    fields.push('category_id = ?')
    values.push(updateData.category_id)
  }
  if (updateData.name) {
    fields.push('name = ?')
    values.push(updateData.name)
  }
  if (updateData.description !== undefined) {
    fields.push('description = ?')
    values.push(updateData.description)
  }
  if (updateData.photo_url !== undefined) {
    fields.push('photo_url = ?')
    values.push(updateData.photo_url)
  }

  if (fields.length === 0) return null

  values.push(id)
  const [result] = await db.execute(
    `UPDATE subcategories SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null
  return getSubcategoryById(id)
}

/**
 * Delete subcategory
 * @param {number} id - Subcategory ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteSubcategory = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM subcategories WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

/**
 * Get subcategories with their child categories
 * @param {number} categoryId - Category ID (optional)
 * @returns {Promise<Array>} - Array of subcategories with nested child categories
 */
export const getSubcategoriesWithChildCategories = async (categoryId = null) => {
  let query = `
    SELECT s.*,
           JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', cc.id,
               'name', cc.name,
               'description', cc.description
             )
           ) as child_categories
     FROM subcategories s
     LEFT JOIN child_categories cc ON s.id = cc.subcategory_id
  `
  const params = []
  
  if (categoryId) {
    query += ' WHERE s.category_id = ?'
    params.push(categoryId)
  }
  
  query += ' GROUP BY s.id ORDER BY s.name ASC'
  
  const [rows] = await db.execute(query, params)
  
  // Parse JSON child categories
  return rows.map(row => ({
    ...row,
    child_categories: row.child_categories ? JSON.parse(row.child_categories) : []
  }))
}

