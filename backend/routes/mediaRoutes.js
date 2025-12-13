/**
 * Media Routes
 * Main router combining image and video routes
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as productMediaModel from '../models/productMediaModel.js'
import * as imageModel from '../models/imageModel.js'
import * as videoModel from '../models/videoModel.js'
import * as productModel from '../models/productModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { deleteFile } from '../utils/s3Service.js'
import imageRoutes from './imageRoutes.js'
import videoRoutes from './videoRoutes.js'

const router = express.Router()

// All routes require admin authentication
router.use(protect, admin)

// Use separate route files
router.use('/', imageRoutes)
router.use('/', videoRoutes)

/**
 * GET /api/admin/products/:productId/media
 * Get all media (images + videos) for a product
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/products/:productId/media', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    
    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    
    const images = await imageModel.getProductImages(productId)
    const videos = await videoModel.getProductVideos(productId)
    
    res.json({ images, videos })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/images
 * Get all images with pagination and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/images', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      productId: req.query.productId ? parseInt(req.query.productId) : null
    }
    const result = await imageModel.getAllImages(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/admin/videos
 * Get all videos with pagination and filters
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/videos', async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || '',
      productId: req.query.productId ? parseInt(req.query.productId) : null
    }
    const result = await videoModel.getAllVideos(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/products/:productId/media/bulk
 * Bulk delete media
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/products/:productId/media/bulk', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    
    const { imageIds = [], videoIds = [] } = req.body
    if (imageIds.length === 0 && videoIds.length === 0) {
      return res.status(400).json({ message: 'No media IDs provided' })
    }
    
    const useS3 = process.env.USE_AWS_S3 === 'true'
    const deleted = []
    const errors = []
    
    for (const imageId of imageIds) {
      try {
        const image = await imageModel.getProductImageById(imageId)
        if (image && image.product_id === productId) {
          if (useS3 && image.image_url) {
            try {
              await deleteFile(image.image_url)
            } catch (error) {
              // Continue with DB deletion
            }
          }
          await imageModel.deleteProductImage(imageId)
          deleted.push({ type: 'image', id: imageId })
        }
      } catch (error) {
        errors.push({ type: 'image', id: imageId, error: error.message })
      }
    }
    
    for (const videoId of videoIds) {
      try {
        const video = await videoModel.getProductVideoById(videoId)
        if (video && video.product_id === productId) {
          if (useS3 && video.video_url) {
            try {
              await deleteFile(video.video_url)
            } catch (error) {
              // Continue with DB deletion
            }
          }
          await videoModel.deleteProductVideo(videoId)
          deleted.push({ type: 'video', id: videoId })
        }
      } catch (error) {
        errors.push({ type: 'video', id: videoId, error: error.message })
      }
    }
    
    res.json({
      message: `Deleted ${deleted.length} media items`,
      deleted,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
