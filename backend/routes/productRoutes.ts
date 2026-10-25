/**
 * Product Routes
 * Handles all product-related API endpoints
 * @author Thang Truong
 * @date 2025-12-12
 */

import type { Request, Response, NextFunction } from "express";
import express from 'express'
import * as productModel from '../models/productModel.js'
import * as productMediaModel from '../models/productMediaModel.js'
import * as categoryModel from '../models/categoryModel.js'
import * as subcategoryModel from '../models/subcategoryModel.js'
import * as childCategoryModel from '../models/childCategoryModel.js'
import { protect, admin, optionalAuth } from '../middleware/authMiddleware.js'
import * as productViewModel from '../models/productViewModel.js'
import { getSessionId } from '../middleware/sessionMiddleware.js'
import { uploadImage, uploadVideo, resizeImage } from '../middleware/uploadMiddleware.js'
import { uploadImageWithResize, uploadVideo as uploadVideoToS3 } from '../utils/s3Service.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

/**
 * GET /api/products
 * Get all products with filters, pagination, and search
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const filters: Record<string, any> = {
      page: parseInt(String(req.query.page)) || 1,
      limit: parseInt(String(req.query.limit)) || 15,
      category: req.query.category ? parseInt(String(req.query.category)) : null,
      subcategory: req.query.subcategory ? parseInt(String(req.query.subcategory)) : null,
      childCategory: req.query.childCategory ? parseInt(String(req.query.childCategory)) : null,
      minPrice: req.query.minPrice ? parseFloat(String(req.query.minPrice)) : null,
      maxPrice: req.query.maxPrice ? parseFloat(String(req.query.maxPrice)) : null,
      search: req.query.search || null,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    }

    const result = await productModel.getAllProducts(filters)
    res.json(result)
  } catch (error: unknown) {
    res.status(500).json({ 
      message: (error instanceof Error ? error.message : String(error)) || 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    })
  }
})

/**
 * GET /api/products/clearance
 * Get all clearance products (products marked for clearance)
 * Business logic: Shows all products with is_on_clearance=true
 * Optionally filters by category when category query parameter is provided
 * Discount fields are optional - if present and active, discounted price is calculated
 * @author Thang Truong
 * @date 2025-12-17
 */
router.get('/clearance', async (req: Request, res: Response) => {
  try {
    const filters: Record<string, any> = {
      page: parseInt(String(req.query.page)) || 1,
      limit: parseInt(String(req.query.limit)) || 15,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC',
      categoryId: req.query.category ? parseInt(String(req.query.category)) : null
    }

    const result = await productModel.getClearanceProducts(filters)
    res.json(result)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/products/categories
 * Get all categories with their subcategories
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await categoryModel.getCategoriesWithSubcategories()
    res.json(categories)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/products/subcategories
 * Get all subcategories
 */
router.get('/subcategories', async (req: Request, res: Response) => {
  try {
    const subcategories = await subcategoryModel.getAllSubcategories()
    res.json(subcategories)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/products/subcategories/:categoryId
 * Get subcategories by category ID
 */
router.get('/subcategories/:categoryId', async (req: Request, res: Response) => {
  try {
    const subcategories = await subcategoryModel.getSubcategoriesByCategory(
      parseInt(req.params.categoryId)
    )
    res.json(subcategories)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/products/child-categories/:subcategoryId
 * Get child categories by subcategory ID
 */
router.get('/child-categories/:subcategoryId', async (req: Request, res: Response) => {
  try {
    const subcategoryId = parseInt(req.params.subcategoryId)
    const children = await childCategoryModel.getChildCategoriesBySubcategory(subcategoryId)
    res.json(children)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/products/child-category/:id
 * Get a single child category with hierarchy info
 */
router.get('/child-category/:id', async (req: Request, res: Response) => {
  try {
    const childId = parseInt(req.params.id)
    const child = await childCategoryModel.getChildCategoryById(childId)
    if (!child) return res.status(404).json({ message: 'Child category not found' })
    res.json(child)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * GET /api/products/:id
 * Get single product by ID with images and videos
 * Also records product view for tracking
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/:id', getSessionId, optionalAuth, async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    
    // Record product view (non-blocking - don't wait for it)
    const userId = req.user?.id || null
    const sessionId = req.user ? null : req.guestSessionId
    productViewModel.recordProductView(productId, userId, sessionId).catch(() => {
      // Silently fail - don't break product retrieval
    })
    
    res.json(product)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * POST /api/products
 * Create new product (admin only)
 */
router.post('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      description, 
      price, 
      child_category_id, 
      stock,
      discount_type,
      discount_value,
      discount_start_date,
      discount_end_date,
      is_on_clearance
    } = req.body

    if (!name || !description || !price || !child_category_id || stock === undefined) {
      return res.status(400).json({ message: 'All required fields are missing' })
    }

    // Validate discount fields if provided
    if (discount_type || discount_value || discount_start_date || discount_end_date) {
      if (!discount_type || discount_value === undefined || !discount_start_date || !discount_end_date) {
        return res.status(400).json({ 
          message: 'If discount is provided, discount_type, discount_value, discount_start_date, and discount_end_date are all required' 
        })
      }
      
      if (!['percentage', 'fixed'].includes(discount_type)) {
        return res.status(400).json({ message: 'discount_type must be "percentage" or "fixed"' })
      }
      
      const numDiscountValue = parseFloat(discount_value)
      if (isNaN(numDiscountValue) || numDiscountValue <= 0) {
        return res.status(400).json({ message: 'discount_value must be a positive number' })
      }
      
      if (discount_type === 'percentage' && numDiscountValue > 100) {
        return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' })
      }
      
      if (discount_type === 'fixed') {
        const numPrice = parseFloat(price)
        if (numDiscountValue >= numPrice) {
          return res.status(400).json({ message: 'Fixed discount must be less than product price' })
        }
      }
      
      const startDate = new Date(discount_start_date)
      const endDate = new Date(discount_end_date)
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format for discount dates' })
      }
      
      if (startDate >= endDate) {
        return res.status(400).json({ message: 'discount_start_date must be before discount_end_date' })
      }
    }

    const productId = await productModel.createProduct({
      name,
      description,
      price: parseFloat(price),
      child_category_id: parseInt(child_category_id),
      stock: parseInt(stock),
      discount_type: discount_type || null,
      discount_value: discount_value ? parseFloat(discount_value) : null,
      discount_start_date: discount_start_date || null,
      discount_end_date: discount_end_date || null,
      is_on_clearance: is_on_clearance || false
    })

    const product = await productModel.getProductById(productId)
    res.status(201).json(product)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * PUT /api/products/:id
 * Update product (admin only)
 */
router.put('/:id', protect, admin, async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id)
    const updateData: Record<string, any> = {};

    if (req.body.name) updateData.name = req.body.name
    if (req.body.description) updateData.description = req.body.description
    if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price)
    if (req.body.child_category_id) updateData.child_category_id = parseInt(req.body.child_category_id)
    if (req.body.stock !== undefined) updateData.stock = parseInt(req.body.stock)
    if (req.body.discount_type !== undefined) updateData.discount_type = req.body.discount_type || null
    if (req.body.discount_value !== undefined) updateData.discount_value = req.body.discount_value ? parseFloat(req.body.discount_value) : null
    if (req.body.discount_start_date !== undefined) updateData.discount_start_date = req.body.discount_start_date || null
    if (req.body.discount_end_date !== undefined) updateData.discount_end_date = req.body.discount_end_date || null
    if (req.body.is_on_clearance !== undefined) updateData.is_on_clearance = req.body.is_on_clearance

    // Validate discount fields if any discount field is being updated
    const hasDiscountFields = updateData.discount_type !== undefined || 
                             updateData.discount_value !== undefined || 
                             updateData.discount_start_date !== undefined || 
                             updateData.discount_end_date !== undefined
    
    if (hasDiscountFields) {
      // If any discount field is set, all must be provided (unless clearing discount)
      const discountType = updateData.discount_type !== undefined ? updateData.discount_type : req.body.discount_type
      const discountValue = updateData.discount_value !== undefined ? updateData.discount_value : req.body.discount_value
      const startDate = updateData.discount_start_date !== undefined ? updateData.discount_start_date : req.body.discount_start_date
      const endDate = updateData.discount_end_date !== undefined ? updateData.discount_end_date : req.body.discount_end_date
      
      // Allow clearing discount by setting type to null
      if (discountType !== null && discountType !== undefined) {
        if (discountValue === undefined || !startDate || !endDate) {
          return res.status(400).json({ 
            message: 'If discount_type is set, discount_value, discount_start_date, and discount_end_date are all required' 
          })
        }
        
        if (!['percentage', 'fixed'].includes(discountType)) {
          return res.status(400).json({ message: 'discount_type must be "percentage" or "fixed"' })
        }
        
        const numDiscountValue = parseFloat(discountValue)
        if (isNaN(numDiscountValue) || numDiscountValue <= 0) {
          return res.status(400).json({ message: 'discount_value must be a positive number' })
        }
        
        if (discountType === 'percentage' && numDiscountValue > 100) {
          return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' })
        }
        
        if (discountType === 'fixed') {
          // Get current product price to validate fixed discount
          const currentProduct = await productModel.getProductById(productId)
          const productPrice = updateData.price !== undefined ? parseFloat(updateData.price) : (currentProduct ? parseFloat(String(currentProduct.price)) : 0)
          if (numDiscountValue >= productPrice) {
            return res.status(400).json({ message: 'Fixed discount must be less than product price' })
          }
        }
        
        const startDateObj = new Date(startDate)
        const endDateObj = new Date(endDate)
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
          return res.status(400).json({ message: 'Invalid date format for discount dates' })
        }
        
        if (startDateObj >= endDateObj) {
          return res.status(400).json({ message: 'discount_start_date must be before discount_end_date' })
        }
      }
    }

    const updatedProduct = await productModel.updateProduct(productId, updateData)
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(updatedProduct)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * DELETE /api/products/:id
 * Delete product (admin only)
 */
router.delete('/:id', protect, admin, async (req: Request, res: Response) => {
  try {
    const deleted = await productModel.deleteProduct(parseInt(req.params.id))
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * POST /api/products/:id/images
 * Upload product images (admin only)
 * Resizes images to 500x500 (1:1 aspect ratio) for optimal display
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/:id/images', protect, admin, uploadImage.array('images', 10), async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id)
    
    // Check if product exists
    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const uploadedFiles = req.files as Express.Multer.File[]
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' })
    }

    const useS3 = process.env.USE_AWS_S3 === 'true'
    const imageUrls = []
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      let imageUrl
      const isPrimary = i === 0 && product.images!.length === 0
      
      if (useS3) {
        // Upload to S3 with resize
        imageUrl = await uploadImageWithResize(file.buffer, file.originalname, productId)
      } else {
        // Local storage (existing logic)
        const uploadsDir = path.join(__dirname, '../uploads/images')
        const originalPath = file.path
        const resizedPath = path.join(uploadsDir, `resized-${file.filename}`)
        
        // Resize image to 500x500
        await resizeImage(originalPath, resizedPath)
        
        // Replace original with resized version
        if (fs.existsSync(resizedPath)) {
          fs.renameSync(resizedPath, originalPath)
        }
        
        imageUrl = `/uploads/images/${file.filename}`
      }
      
      await productMediaModel.addProductImage(productId, imageUrl, isPrimary)
      imageUrls.push(imageUrl)
    }

    res.status(201).json({ 
      message: 'Images uploaded and resized successfully',
      images: imageUrls
    })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * POST /api/products/:id/videos
 * Upload product video (admin only, optional)
 */
router.post('/:id/videos', protect, admin, uploadVideo.single('video'), async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id)
    
    // Check if product exists
    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' })
    }

    const useS3 = process.env.USE_AWS_S3 === 'true'
    const isPrimary = product.videos!.length === 0
    let videoUrl
    
    if (useS3) {
      // Upload to S3
      videoUrl = await uploadVideoToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        productId
      )
    } else {
      // Local storage
      videoUrl = `/uploads/videos/${req.file.filename}`
    }

    await productMediaModel.addProductVideo(productId, {
      video_url: videoUrl,
      title: req.body.title || null,
      description: req.body.description || null,
      thumbnail_url: req.body.thumbnail_url || null,
      duration: req.body.duration ? parseInt(req.body.duration) : null,
      is_primary: isPrimary
    })

    res.status(201).json({ 
      message: 'Video uploaded successfully',
      video: videoUrl
    })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

export default router
