/**
 * Category Model
 * Handles all database operations related to product categories
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import db from '../config/db.js'

/**
 * Get all categories
 * @returns {Promise<Array>} - Array of category objects
 */
export const getAllCategories = async () => {
  const [rows] = await db.execute(
    'SELECT * FROM categories ORDER BY name ASC'
  )
  return rows
}

/**
 * Get all categories with pagination and filters
 * @param {Object} filters - Filter options (page, limit, search, sortBy, sortOrder)
 * @returns {Promise<Object>} - Categories with pagination info
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getAllCategoriesPaginated = async (filters = {}) => {
  const page = parseInt(filters.page) || 1
  const limit = parseInt(filters.limit) || 20
  const offset = (page - 1) * limit
  const search = filters.search || ''
  const sortBy = filters.sortBy || 'name'
  const sortOrder = filters.sortOrder || 'asc'
  
  // Allowed sort columns
  const allowedSortColumns = ['id', 'name', 'description', 'created_at', 'updated_at']
  const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'name'
  const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
  
  let query = 'SELECT * FROM categories'
  const params = []
  
  if (search) {
    query += ' WHERE name LIKE ? OR description LIKE ?'
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern)
  }
  
  query += ` ORDER BY ${validSortBy} ${validSortOrder}`
  
  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total')
  const [countResult] = await db.execute(countQuery, params)
  const total = countResult[0].total
  
  // Get paginated results
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute(query, params)
  
  return {
    categories: rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get categories with their subcategories and child categories (3-level hierarchy)
 * @returns {Promise<Array>} - Array of categories with nested subcategories and child categories
 */
export const getCategoriesWithSubcategories = async () => {
  // Get categories with subcategories
  // Note: Fetch subcategories separately to avoid DISTINCT JSON_OBJECT syntax issues
  const [categoryRows] = await db.execute(
    `SELECT c.*
     FROM categories c
     ORDER BY c.name ASC`
  )
  
  // Get all subcategories grouped by category
  const [subcategoryRows] = await db.execute(
    `SELECT s.*, s.category_id
     FROM subcategories s
     ORDER BY s.category_id, s.name ASC`
  )
  
  // Group subcategories by category_id
  const subcategoriesByCategory = {}
  subcategoryRows.forEach(sub => {
    if (!subcategoriesByCategory[sub.category_id]) {
      subcategoriesByCategory[sub.category_id] = []
    }
    subcategoriesByCategory[sub.category_id].push({
      id: sub.id,
      name: sub.name,
      description: sub.description
    })
  })
  
  // Get child categories grouped by subcategory
  // Initialize childMap for all subcategories first
  const childMap = {}
  subcategoryRows.forEach(sub => {
    childMap[sub.id] = []
  })
  
  // Fetch all child categories and group by subcategory_id
  const [childCategoryRows] = await db.execute(
    `SELECT id, subcategory_id, name, description
     FROM child_categories
     ORDER BY subcategory_id, name ASC`
  )
  
  // Group child categories by subcategory_id
  childCategoryRows.forEach(child => {
    if (!childMap[child.subcategory_id]) {
      childMap[child.subcategory_id] = []
    }
    childMap[child.subcategory_id].push({
      id: child.id,
      name: child.name,
      description: child.description
    })
  })
  
  // Attach subcategories and child categories to categories
  return categoryRows.map(category => {
    const subcategories = subcategoriesByCategory[category.id] || []
    const subcategoriesWithChildren = subcategories.map(sub => ({
      ...sub,
      child_categories: childMap[sub.id] || []
    }))
    
    return {
      ...category,
      subcategories: subcategoriesWithChildren
    }
  })
}

/**
 * Get category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object|null>} - Category object or null
 */
export const getCategoryById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  )
  return rows[0] || null
}

/**
 * Create a new category
 * @param {string} name - Category name
 * @param {string} description - Category description
 * @returns {Promise<number>} - Inserted category ID
 */
export const createCategory = async (name, description = null) => {
  const [result] = await db.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description]
  )
  return result.insertId
}

/**
 * Update category
 * @param {number} id - Category ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated category or null
 */
export const updateCategory = async (id, updateData) => {
  const fields = []
  const values = []

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
    `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
    values
  )

  if (result.affectedRows === 0) return null
  return getCategoryById(id)
}

/**
 * Delete category
 * @param {number} id - Category ID
 * @returns {Promise<boolean>} - True if deleted, false otherwise
 */
export const deleteCategory = async (id) => {
  const [result] = await db.execute(
    'DELETE FROM categories WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

