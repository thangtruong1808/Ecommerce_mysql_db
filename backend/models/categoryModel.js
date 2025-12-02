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
 * Get categories with their subcategories
 * @returns {Promise<Array>} - Array of categories with nested subcategories
 */
export const getCategoriesWithSubcategories = async () => {
  const [rows] = await db.execute(
    `SELECT c.*, 
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', s.id,
                'name', s.name,
                'description', s.description
              )
            ) as subcategories
     FROM categories c
     LEFT JOIN subcategories s ON c.id = s.category_id
     GROUP BY c.id
     ORDER BY c.name ASC`
  )
  
  // Parse JSON subcategories
  return rows.map(row => ({
    ...row,
    subcategories: row.subcategories ? JSON.parse(row.subcategories) : []
  }))
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

