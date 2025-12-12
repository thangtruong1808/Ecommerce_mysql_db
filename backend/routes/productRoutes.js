/**
 * Product Routes
 * Handles all product-related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import * as productModel from '../models/productModel.js'
import * as productMediaModel from '../models/productMediaModel.js'
import * as categoryModel from '../models/categoryModel.js'
import * as subcategoryModel from '../models/subcategoryModel.js'
import * as childCategoryModel from '../models/childCategoryModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { uploadImage, uploadVideo } from '../middleware/uploadMiddleware.js'

const router = express.Router()

/**
 * GET /api/products
 * Get all products with filters, pagination, and search
 */
router.get('/', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      category: req.query.category ? parseInt(req.query.category) : null,
      subcategory: req.query.subcategory ? parseInt(req.query.subcategory) : null,
      childCategory: req.query.childCategory ? parseInt(req.query.childCategory) : null,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      search: req.query.search || null,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    }

    const result = await productModel.getAllProducts(filters)
    res.json(result)
  } catch (error) {
    console.error('Error fetching products:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({ 
      message: error.message || 'Failed to fetch products',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

/**
 * GET /api/products/clearance
 * Get all clearance products (products with active discounts)
 */
router.get('/clearance', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 12,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    }

    const result = await productModel.getClearanceProducts(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/categories
 * Get all categories with their subcategories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryModel.getCategoriesWithSubcategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/subcategories
 * Get all subcategories
 */
router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await subcategoryModel.getAllSubcategories()
    res.json(subcategories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/subcategories/:categoryId
 * Get subcategories by category ID
 */
router.get('/subcategories/:categoryId', async (req, res) => {
  try {
    const subcategories = await subcategoryModel.getSubcategoriesByCategory(
      parseInt(req.params.categoryId)
    )
    res.json(subcategories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/child-categories/:subcategoryId
 * Get child categories by subcategory ID
 */
router.get('/child-categories/:subcategoryId', async (req, res) => {
  try {
    const subcategoryId = parseInt(req.params.subcategoryId)
    const children = await childCategoryModel.getChildCategoriesBySubcategory(subcategoryId)
    res.json(children)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/child-category/:id
 * Get a single child category with hierarchy info
 */
router.get('/child-category/:id', async (req, res) => {
  try {
    const childId = parseInt(req.params.id)
    const child = await childCategoryModel.getChildCategoryById(childId)
    if (!child) return res.status(404).json({ message: 'Child category not found' })
    res.json(child)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/products/:id
 * Get single product by ID with images and videos
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await productModel.getProductById(parseInt(req.params.id))
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/products
 * Create new product (admin only)
 */
router.post('/', protect, admin, async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/products/:id
 * Update product (admin only)
 */
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    const updateData = {}

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

    const updatedProduct = await productModel.updateProduct(productId, updateData)
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/products/:id
 * Delete product (admin only)
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const deleted = await productModel.deleteProduct(parseInt(req.params.id))
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/products/:id/images
 * Upload product images (admin only)
 */
router.post('/:id/images', protect, admin, uploadImage.array('images', 10), async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    
    // Check if product exists
    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' })
    }

      const imageUrls = []
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i]
        const imageUrl = `/uploads/images/${file.filename}`
        const isPrimary = i === 0 && product.images.length === 0
        
        await productMediaModel.addProductImage(productId, imageUrl, isPrimary)
        imageUrls.push(imageUrl)
      }

    res.status(201).json({ 
      message: 'Images uploaded successfully',
      images: imageUrls
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/products/:id/videos
 * Upload product video (admin only, optional)
 */
router.post('/:id/videos', protect, admin, uploadVideo.single('video'), async (req, res) => {
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

    const videoUrl = `/uploads/videos/${req.file.filename}`
    const isPrimary = product.videos.length === 0

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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
