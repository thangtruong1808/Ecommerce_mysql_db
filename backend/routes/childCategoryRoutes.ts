/**
 * Child Category Routes
 * Handles CRUD operations for product child categories (admin only)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Request, Response, NextFunction } from "express";
import express from 'express'
import * as childCategoryModel from '../models/childCategoryModel.js'
import * as subcategoryModel from '../models/subcategoryModel.js'
import * as productModel from '../models/productModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, admin)

/**
 * GET /api/admin/child-categories
 * Get all child categories with pagination, search, and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: Record<string, any> = {
      page: parseInt(String(req.query.page)) || 1,
      limit: parseInt(String(req.query.limit)) || 20,
      search: req.query.search || '',
      subcategoryId: req.query.subcategoryId ? parseInt(String(req.query.subcategoryId)) : null,
      sortBy: req.query.sortBy || 'name',
      sortOrder: req.query.sortOrder || 'asc'
    }
    const result = await childCategoryModel.getAllChildCategoriesPaginated(filters)
    res.json(result)
  } catch (error: unknown) {
    res.status(500).json({ 
      message: (error instanceof Error ? error.message : String(error)),
      childCategories: [],
      pagination: {
        page: parseInt(String(req.query.page)) || 1,
        limit: parseInt(String(req.query.limit)) || 20,
        total: 0,
        pages: 0
      }
    })
  }
})

/**
 * POST /api/admin/child-categories
 * Create new child category
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { subcategory_id, name, description } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Child category name is required' })
    }
    
    if (!subcategory_id || isNaN(parseInt(subcategory_id))) {
      return res.status(400).json({ message: 'Valid subcategory ID is required' })
    }
    
    // Verify subcategory exists
    const subcategory = await subcategoryModel.getSubcategoryById(parseInt(subcategory_id))
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    
    const childCategoryId = await childCategoryModel.createChildCategory(
      parseInt(subcategory_id),
      name.trim(),
      description || null
    )
    const childCategory = await childCategoryModel.getChildCategoryById(childCategoryId)
    res.status(201).json(childCategory)
  } catch (error: unknown) {
    if ((typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined) === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Child category name already exists for this subcategory' })
    }
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * PUT /api/admin/child-categories/:id
 * Update child category
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const childCategoryId = parseInt(req.params.id)
    const { subcategory_id, name, description } = req.body
    
    if (isNaN(childCategoryId) || childCategoryId <= 0) {
      return res.status(400).json({ message: 'Invalid child category ID' })
    }
    
    const childCategory = await childCategoryModel.getChildCategoryById(childCategoryId)
    if (!childCategory) {
      return res.status(404).json({ message: 'Child category not found' })
    }
    
    // Verify subcategory exists if subcategory_id is being updated
    if (subcategory_id !== undefined) {
      const subcategory = await subcategoryModel.getSubcategoryById(parseInt(subcategory_id))
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' })
      }
    }
    
    const updateData: Record<string, any> = {};
    if (subcategory_id !== undefined) updateData.subcategory_id = parseInt(subcategory_id)
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description
    
    const updated = await childCategoryModel.updateChildCategory(childCategoryId, updateData)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update child category' })
    }
    
    res.json(updated)
  } catch (error: unknown) {
    if ((typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined) === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Child category name already exists for this subcategory' })
    }
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * DELETE /api/admin/child-categories/:id
 * Delete child category (with validation for existing products)
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const childCategoryId = parseInt(req.params.id)
    
    if (isNaN(childCategoryId) || childCategoryId <= 0) {
      return res.status(400).json({ message: 'Invalid child category ID' })
    }
    
    const childCategory = await childCategoryModel.getChildCategoryById(childCategoryId)
    if (!childCategory) {
      return res.status(404).json({ message: 'Child category not found' })
    }
    
    // Check if child category has products
    const db = (await import('../config/db.js')).default
    const [products] = await db.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM products WHERE child_category_id = ?',
      [childCategoryId]
    )
    if (products[0].count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete child category. It has ${products[0].count} product(s). Please move or delete products first.` 
      })
    }
    
    const deleted = await childCategoryModel.deleteChildCategory(childCategoryId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete child category' })
    }
    
    res.json({ message: 'Child category deleted successfully' })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * POST /api/admin/child-categories/bulk-delete
 * Bulk delete child categories
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/bulk-delete', async (req: Request, res: Response) => {
  try {
    const { childCategoryIds } = req.body
    
    if (!Array.isArray(childCategoryIds) || childCategoryIds.length === 0) {
      return res.status(400).json({ message: 'Child category IDs array is required' })
    }
    
    const deleted = []
    const errors = []
    const db = (await import('../config/db.js')).default
    
    for (const childCategoryId of childCategoryIds) {
      try {
        const id = parseInt(childCategoryId)
        if (isNaN(id) || id <= 0) {
          errors.push({ id: childCategoryId, error: 'Invalid child category ID' })
          continue
        }
        
        // Check if child category has products
        const [products] = await db.execute<RowDataPacket[]>(
          'SELECT COUNT(*) as count FROM products WHERE child_category_id = ?',
          [id]
        )
        if (products[0].count > 0) {
          errors.push({ id, error: `Has ${products[0].count} product(s)` })
          continue
        }
        
        const result = await childCategoryModel.deleteChildCategory(id)
        if (result) {
          deleted.push(id)
        } else {
          errors.push({ id, error: 'Child category not found' })
        }
      } catch (error: unknown) {
        errors.push({ id: childCategoryId, error: (error instanceof Error ? error.message : String(error)) })
      }
    }
    
    res.json({
      message: `${deleted.length} child category(ies) deleted successfully`,
      deleted,
      errors
    })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

export default router
