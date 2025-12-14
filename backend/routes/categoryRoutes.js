/**
 * Category Routes
 * Handles CRUD operations for product categories (admin only)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as categoryModel from '../models/categoryModel.js'
import * as subcategoryModel from '../models/subcategoryModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import db from '../config/db.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, admin)

/**
 * GET /api/admin/categories
 * Get all categories with pagination, search, and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || ''
    }
    const result = await categoryModel.getAllCategoriesPaginated(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/categories
 * Create new category
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' })
    }
    
    const categoryId = await categoryModel.createCategory(name.trim(), description || null)
    const category = await categoryModel.getCategoryById(categoryId)
    res.status(201).json(category)
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category name already exists' })
    }
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/categories/:id
 * Update category
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    const { name, description } = req.body
    
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }
    
    const category = await categoryModel.getCategoryById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    const updateData = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description
    
    const updated = await categoryModel.updateCategory(categoryId, updateData)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update category' })
    }
    
    res.json(updated)
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Category name already exists' })
    }
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/categories/:id
 * Delete category (with validation for existing subcategories)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }
    
    const category = await categoryModel.getCategoryById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    // Check if category has subcategories
    const subcategories = await subcategoryModel.getSubcategoriesByCategory(categoryId)
    if (subcategories.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It has ${subcategories.length} subcategory(ies). Please delete subcategories first.` 
      })
    }
    
    const deleted = await categoryModel.deleteCategory(categoryId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete category' })
    }
    
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/categories/bulk-delete
 * Bulk delete categories
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/bulk-delete', async (req, res) => {
  try {
    const { categoryIds } = req.body
    
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ message: 'Category IDs array is required' })
    }
    
    const deleted = []
    const errors = []
    
    for (const categoryId of categoryIds) {
      try {
        const id = parseInt(categoryId)
        if (isNaN(id) || id <= 0) {
          errors.push({ id: categoryId, error: 'Invalid category ID' })
          continue
        }
        
        // Check if category has subcategories
        const subcategories = await subcategoryModel.getSubcategoriesByCategory(id)
        if (subcategories.length > 0) {
          errors.push({ id, error: `Has ${subcategories.length} subcategory(ies)` })
          continue
        }
        
        const result = await categoryModel.deleteCategory(id)
        if (result) {
          deleted.push(id)
        } else {
          errors.push({ id, error: 'Category not found' })
        }
      } catch (error) {
        errors.push({ id: categoryId, error: error.message })
      }
    }
    
    res.json({
      message: `${deleted.length} category(ies) deleted successfully`,
      deleted,
      errors
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
