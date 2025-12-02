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

