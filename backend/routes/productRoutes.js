/**
 * Product Routes
 * Handles all product-related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import * as productModel from '../models/productModel.js'
import * as categoryModel from '../models/categoryModel.js'
import * as subcategoryModel from '../models/subcategoryModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

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
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : null,
      search: req.query.search || null,
      sortBy: req.query.sortBy || 'created_at',
      sortOrder: req.query.sortOrder || 'DESC'
    }

    const result = await productModel.getAllProducts(filters)
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
    const { name, description, price, subcategory_id, stock } = req.body

    if (!name || !description || !price || !subcategory_id || stock === undefined) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const productId = await productModel.createProduct({
      name,
      description,
      price: parseFloat(price),
      subcategory_id: parseInt(subcategory_id),
      stock: parseInt(stock)
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
    if (req.body.subcategory_id) updateData.subcategory_id = parseInt(req.body.subcategory_id)
    if (req.body.stock !== undefined) updateData.stock = parseInt(req.body.stock)

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

export default router
