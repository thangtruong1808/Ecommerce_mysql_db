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
import { uploadImage } from '../middleware/uploadMiddleware.js'
import { uploadSubcategoryImage, deleteFile } from '../utils/s3Service.js'
import path from 'path'
import fs from 'fs'

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
 * Create new subcategory with optional photo upload
 * @author Thang Truong
 * @date 2025-01-28
 */
router.post('/', uploadImage.single('photo'), async (req, res) => {
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
    
    let photoUrl = null
    
    // Handle photo upload if provided
    if (req.file) {
      const useS3 = process.env.USE_AWS_S3 === 'true'
      
      if (useS3) {
        const subcategoryId = await subcategoryModel.createSubcategory(
          parseInt(category_id),
          name.trim(),
          description || null,
          null
        )
        photoUrl = await uploadSubcategoryImage(req.file.buffer, req.file.originalname, subcategoryId)
        await subcategoryModel.updateSubcategory(subcategoryId, { photo_url: photoUrl })
        const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId)
        return res.status(201).json(subcategory)
      } else {
        // Local storage handling
        const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images', 'subcategories')
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        
        const timestamp = Date.now()
        const fileName = `${timestamp}-${req.file.originalname}`
        const filePath = path.join(uploadsDir, fileName)
        
        fs.writeFileSync(filePath, req.file.buffer)
        photoUrl = `/uploads/images/subcategories/${fileName}`
      }
    }
    
    const subcategoryId = await subcategoryModel.createSubcategory(
      parseInt(category_id),
      name.trim(),
      description || null,
      photoUrl
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
 * Update subcategory with optional photo upload
 * @author Thang Truong
 * @date 2025-01-28
 */
router.put('/:id', uploadImage.single('photo'), async (req, res) => {
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
    
    // Handle photo upload if provided
    if (req.file) {
      const useS3 = process.env.USE_AWS_S3 === 'true'
      
      // Delete old photo if exists
      if (subcategory.photo_url) {
        try {
          await deleteFile(subcategory.photo_url)
        } catch (error) {
          // Ignore deletion errors (file might not exist)
        }
      }
      
      if (useS3) {
        const photoUrl = await uploadSubcategoryImage(req.file.buffer, req.file.originalname, subcategoryId)
        updateData.photo_url = photoUrl
      } else {
        // Local storage handling
        const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images', 'subcategories')
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        
        const timestamp = Date.now()
        const fileName = `${timestamp}-${req.file.originalname}`
        const filePath = path.join(uploadsDir, fileName)
        
        fs.writeFileSync(filePath, req.file.buffer)
        updateData.photo_url = `/uploads/images/subcategories/${fileName}`
      }
    }
    
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
 * POST /api/admin/subcategories/:id/photo
 * Upload subcategory photo
 * @author Thang Truong
 * @date 2025-01-28
 */
router.post('/:id/photo', uploadImage.single('photo'), async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.id)
    
    if (isNaN(subcategoryId) || subcategoryId <= 0) {
      return res.status(400).json({ message: 'Invalid subcategory ID' })
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' })
    }
    
    const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId)
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    
    // Delete old photo if exists
    if (subcategory.photo_url) {
      try {
        await deleteFile(subcategory.photo_url)
      } catch (error) {
        // Ignore deletion errors (file might not exist)
      }
    }
    
    const useS3 = process.env.USE_AWS_S3 === 'true'
    let photoUrl
    
    if (useS3) {
      photoUrl = await uploadSubcategoryImage(req.file.buffer, req.file.originalname, subcategoryId)
    } else {
      // Local storage handling
      const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images', 'subcategories')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      
      const timestamp = Date.now()
      const fileName = `${timestamp}-${req.file.originalname}`
      const filePath = path.join(uploadsDir, fileName)
      
      fs.writeFileSync(filePath, req.file.buffer)
      photoUrl = `/uploads/images/subcategories/${fileName}`
    }
    
    await subcategoryModel.updateSubcategory(subcategoryId, { photo_url: photoUrl })
    const updated = await subcategoryModel.getSubcategoryById(subcategoryId)
    
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/subcategories/:id/photo
 * Delete subcategory photo
 * @author Thang Truong
 * @date 2025-01-28
 */
router.delete('/:id/photo', async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.id)
    
    if (isNaN(subcategoryId) || subcategoryId <= 0) {
      return res.status(400).json({ message: 'Invalid subcategory ID' })
    }
    
    const subcategory = await subcategoryModel.getSubcategoryById(subcategoryId)
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    
    if (!subcategory.photo_url) {
      return res.status(400).json({ message: 'Subcategory has no photo' })
    }
    
    // Delete photo from S3 or local storage
    try {
      await deleteFile(subcategory.photo_url)
    } catch (error) {
      // Ignore deletion errors (file might not exist)
    }
    
    // Set photo_url to NULL in database
    await subcategoryModel.updateSubcategory(subcategoryId, { photo_url: null })
    const updated = await subcategoryModel.getSubcategoryById(subcategoryId)
    
    res.json(updated)
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
