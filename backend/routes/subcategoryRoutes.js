/**
 * Subcategory Routes
 * Handles CRUD operations for product subcategories (admin only)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as subcategoryModel from '../models/subcategoryModel.js'
import * as childCategoryModel from '../models/childCategoryModel.js'
import * as categoryModel from '../models/categoryModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, admin)

/**
 * GET /api/admin/subcategories
 * Get all subcategories with pagination, search, and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null
    }
    const result = await subcategoryModel.getAllSubcategoriesPaginated(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/subcategories
 * Create new subcategory
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/', async (req, res) => {
  try {
    const { category_id, name, description } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Subcategory name is required' })
    }
    
    if (!category_id || isNaN(parseInt(category_id))) {
      return res.status(400).json({ message: 'Valid category ID is required' })
    }
    
    // Verify category exists
    const category = await categoryModel.getCategoryById(parseInt(category_id))
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    const subcategoryId = await subcategoryModel.createSubcategory(
      parseInt(category_id),
      name.trim(),
      description || null
    )
    const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId)
    res.status(201).json(subcategory)
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Subcategory name already exists for this category' })
    }
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/subcategories/:id
 * Update subcategory
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/:id', async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.id)
    const { category_id, name, description } = req.body
    
    if (isNaN(subcategoryId) || subcategoryId <= 0) {
      return res.status(400).json({ message: 'Invalid subcategory ID' })
    }
    
    const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId)
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    
    // Verify category exists if category_id is being updated
    if (category_id !== undefined) {
      const category = await categoryModel.getCategoryById(parseInt(category_id))
      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }
    }
    
    const updateData = {}
    if (category_id !== undefined) updateData.category_id = parseInt(category_id)
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description
    
    const updated = await subcategoryModel.updateSubcategory(subcategoryId, updateData)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update subcategory' })
    }
    
    res.json(updated)
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Subcategory name already exists for this category' })
    }
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/subcategories/:id
 * Delete subcategory (with validation for existing child categories)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/:id', async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.id)
    
    if (isNaN(subcategoryId) || subcategoryId <= 0) {
      return res.status(400).json({ message: 'Invalid subcategory ID' })
    }
    
    const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId)
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    
    // Check if subcategory has child categories
    const childCategories = await childCategoryModel.getChildCategoriesBySubcategory(subcategoryId)
    if (childCategories.length > 0) {
      return res.status(400).json({ 
        message: `Cannot delete subcategory. It has ${childCategories.length} child category(ies). Please delete child categories first.` 
      })
    }
    
    const deleted = await subcategoryModel.deleteSubcategory(subcategoryId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete subcategory' })
    }
    
    res.json({ message: 'Subcategory deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/subcategories/bulk-delete
 * Bulk delete subcategories
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/bulk-delete', async (req, res) => {
  try {
    const { subcategoryIds } = req.body
    
    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
      return res.status(400).json({ message: 'Subcategory IDs array is required' })
    }
    
    const deleted = []
    const errors = []
    
    for (const subcategoryId of subcategoryIds) {
      try {
        const id = parseInt(subcategoryId)
        if (isNaN(id) || id <= 0) {
          errors.push({ id: subcategoryId, error: 'Invalid subcategory ID' })
          continue
        }
        
        // Check if subcategory has child categories
        const childCategories = await childCategoryModel.getChildCategoriesBySubcategory(id)
        if (childCategories.length > 0) {
          errors.push({ id, error: `Has ${childCategories.length} child category(ies)` })
          continue
        }
        
        const result = await subcategoryModel.deleteSubcategory(id)
        if (result) {
          deleted.push(id)
        } else {
          errors.push({ id, error: 'Subcategory not found' })
        }
      } catch (error) {
        errors.push({ id: subcategoryId, error: error.message })
      }
    }
    
    res.json({
      message: `${deleted.length} subcategory(ies) deleted successfully`,
      deleted,
      errors
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
