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
import { uploadImage } from '../middleware/uploadMiddleware.js'
import { uploadCategoryImage, deleteFile } from '../utils/s3Service.js'
import path from 'path'
import fs from 'fs'
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
 * Create new category with optional photo upload
 * @author Thang Truong
 * @date 2025-01-28
 */
router.post('/', uploadImage.single('photo'), async (req, res) => {
  try {
    const { name, description } = req.body
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' })
    }
    
    let photoUrl = null
    
    // Handle photo upload if provided
    if (req.file) {
      const useS3 = process.env.USE_AWS_S3 === 'true'
      
      if (useS3) {
        const categoryId = await categoryModel.createCategory(name.trim(), description || null, null)
        photoUrl = await uploadCategoryImage(req.file.buffer, req.file.originalname, categoryId)
        await categoryModel.updateCategory(categoryId, { photo_url: photoUrl })
        const category = await categoryModel.getCategoryById(categoryId)
        return res.status(201).json(category)
      } else {
        // Local storage handling - save to disk first, then create category
        const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images', 'categories')
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        
        const timestamp = Date.now()
        const ext = path.extname(req.file.originalname).toLowerCase()
        const fileName = `${timestamp}-${req.file.originalname}`
        const filePath = path.join(uploadsDir, fileName)
        
        fs.writeFileSync(filePath, req.file.buffer)
        photoUrl = `/uploads/images/categories/${fileName}`
      }
    }
    
    const categoryId = await categoryModel.createCategory(name.trim(), description || null, photoUrl)
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
 * Update category with optional photo upload
 * @author Thang Truong
 * @date 2025-01-28
 */
router.put('/:id', uploadImage.single('photo'), async (req, res) => {
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
    
    // Handle photo upload if provided
    if (req.file) {
      const useS3 = process.env.USE_AWS_S3 === 'true'
      
      // Delete old photo if exists
      if (category.photo_url) {
        try {
          await deleteFile(category.photo_url)
        } catch (error) {
          // Ignore deletion errors (file might not exist)
        }
      }
      
      if (useS3) {
        const photoUrl = await uploadCategoryImage(req.file.buffer, req.file.originalname, categoryId)
        updateData.photo_url = photoUrl
      } else {
        // Local storage handling
        const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images', 'categories')
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        
        const timestamp = Date.now()
        const fileName = `${timestamp}-${req.file.originalname}`
        const filePath = path.join(uploadsDir, fileName)
        
        fs.writeFileSync(filePath, req.file.buffer)
        updateData.photo_url = `/uploads/images/categories/${fileName}`
      }
    }
    
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
 * POST /api/admin/categories/:id/photo
 * Upload category photo
 * @author Thang Truong
 * @date 2025-01-28
 */
router.post('/:id/photo', uploadImage.single('photo'), async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' })
    }
    
    const category = await categoryModel.getCategoryById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    // Delete old photo if exists
    if (category.photo_url) {
      try {
        await deleteFile(category.photo_url)
      } catch (error) {
        // Ignore deletion errors (file might not exist)
      }
    }
    
    const useS3 = process.env.USE_AWS_S3 === 'true'
    let photoUrl
    
    if (useS3) {
      photoUrl = await uploadCategoryImage(req.file.buffer, req.file.originalname, categoryId)
    } else {
      // Local storage handling
      const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images', 'categories')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const timestamp = Date.now()
      const fileName = `${timestamp}-${req.file.originalname}`
      const filePath = path.join(uploadsDir, fileName)
      
      fs.writeFileSync(filePath, req.file.buffer)
      photoUrl = `/uploads/images/categories/${fileName}`
    }
    
    await categoryModel.updateCategory(categoryId, { photo_url: photoUrl })
    const updated = await categoryModel.getCategoryById(categoryId)
    
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/categories/:id/photo
 * Delete category photo
 * @author Thang Truong
 * @date 2025-01-28
 */
router.delete('/:id/photo', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id)
    
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }
    
    const category = await categoryModel.getCategoryById(categoryId)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    
    if (!category.photo_url) {
      return res.status(400).json({ message: 'Category has no photo' })
    }
    
    // Delete photo from S3 or local storage
    try {
      await deleteFile(category.photo_url)
    } catch (error) {
      // Ignore deletion errors (file might not exist)
    }
    
    // Set photo_url to NULL in database
    await categoryModel.updateCategory(categoryId, { photo_url: null })
    const updated = await categoryModel.getCategoryById(categoryId)
    
    res.json(updated)
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
