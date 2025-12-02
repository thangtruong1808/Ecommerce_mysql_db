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
 * @returns {Promise<number>} - Inserted subcategory ID
 */
export const createSubcategory = async (categoryId, name, description = null) => {
  const [result] = await db.execute(
    'INSERT INTO subcategories (category_id, name, description) VALUES (?, ?, ?)',
    [categoryId, name, description]
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

