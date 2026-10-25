import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type * as Rows from "../types/domain.js";
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
  const [rows] = await db.execute<Rows.CategoryRow[]>(
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
export const getAllCategoriesPaginated = async (filters: Rows.ListQuery = {}) => {
  const page = parseInt(String(filters.page)) || 1
  const limit = parseInt(String(filters.limit)) || 20
  const offset = (page - 1) * limit
  const search = filters.search || ''
  const sortBy = filters.sortBy || 'name'
  const sortOrder = filters.sortOrder || 'asc'
  
  // Allowed sort columns
  const allowedSortColumns = ['id', 'name', 'description', 'created_at', 'updated_at']
  const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'name'
  const validSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC'
  
  let query = 'SELECT * FROM categories'
  const params: any[] = []
  
  if (search) {
    query += ' WHERE name LIKE ? OR description LIKE ?'
    const searchPattern = `%${search}%`
    params.push(searchPattern, searchPattern)
  }
  
  query += ` ORDER BY ${validSortBy} ${validSortOrder}`
  
  // Get total count
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total')
  const [countResult] = await db.execute<Rows.CountRow[]>(countQuery, params)
  const total = countResult[0].total
  
  // Get paginated results
  query += ` LIMIT ${limit} OFFSET ${offset}`
  
  const [rows] = await db.execute<Rows.CategoryRow[]>(query, params)
  
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
  const [categoryRows] = await db.execute<Rows.CategoryRow[]>(
    `SELECT c.*
     FROM categories c
     ORDER BY c.name ASC`
  )
  
  // Get all subcategories grouped by category
  const [subcategoryRows] = await db.execute<Rows.SubcategoryRow[]>(
    `SELECT s.*, s.category_id
     FROM subcategories s
     ORDER BY s.category_id, s.name ASC`
  )
  
  // Group subcategories by category_id
  const subcategoriesByCategory: Record<string, any> = {}
  subcategoryRows.forEach(sub => {
    if (!subcategoriesByCategory[sub.category_id]) {
      subcategoriesByCategory[sub.category_id] = []
    }
    subcategoriesByCategory[sub.category_id].push({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      photo_url: sub.photo_url
    })
  })
  
  // Get child categories grouped by subcategory
  // Initialize childMap for all subcategories first
  const childMap: Record<string, any> = {}
  subcategoryRows.forEach(sub => {
    childMap[sub.id] = []
  })
  
  // Fetch all child categories and group by subcategory_id
  const [childCategoryRows] = await db.execute<Rows.ChildCategoryRow[]>(
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
    const subcategoriesWithChildren = subcategories.map((sub: any) => ({
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
export const getCategoryById = async (id: number) => {
  const [rows] = await db.execute<Rows.CategoryRow[]>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  )
  return rows[0] || null
}

/**
 * Create a new category
 * @param {string} name - Category name
 * @param {string} description - Category description
 * @param {string} photo_url - Category photo URL
 * @returns {Promise<number>} - Inserted category ID
 * @author Thang Truong
 * @date 2025-01-28
 */
export const createCategory = async (name: string, description: string | null = null, photo_url: string | null = null) => {
  const [result] = await db.execute<ResultSetHeader>(
    'INSERT INTO categories (name, description, photo_url) VALUES (?, ?, ?)',
    [name, description, photo_url]
  )
  return result.insertId
}

/**
 * Update category
 * @param {number} id - Category ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} - Updated category or null
 */
export const updateCategory = async (id: number, updateData: Rows.FieldMap) => {
  const fields: string[] = []
  const values: any[] = []

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
  const [result] = await db.execute<ResultSetHeader>(
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
export const deleteCategory = async (id: number) => {
  const [result] = await db.execute<ResultSetHeader>(
    'DELETE FROM categories WHERE id = ?',
    [id]
  )
  return result.affectedRows > 0
}

