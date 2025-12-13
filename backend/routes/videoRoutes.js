/**
 * Video Routes
 * Handles CRUD operations for product videos
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as videoModel from '../models/videoModel.js'
import * as productMediaModel from '../models/productMediaModel.js'
import * as productModel from '../models/productModel.js'
import { uploadVideo } from '../middleware/uploadMiddleware.js'
import { uploadVideo as uploadVideoToS3, deleteFile } from '../utils/s3Service.js'

const router = express.Router()

// All routes require admin authentication (applied in mediaRoutes.js)

/**
 * GET /api/admin/products/:productId/videos
 * Get all videos for a product
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/products/:productId/videos', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    const videos = await videoModel.getProductVideos(productId)
    res.json(videos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/products/:productId/videos
 * Upload video to S3 or local storage
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/:productId/videos', uploadVideo.single('video'), async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    
    const product = await productModel.getProductById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No video uploaded' })
    }
    
    const useS3 = process.env.USE_AWS_S3 === 'true'
    const isPrimary = product.videos.length === 0
    let videoUrl
    
    if (useS3) {
      videoUrl = await uploadVideoToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        productId
      )
    } else {
      videoUrl = `/uploads/videos/${req.file.filename}`
    }
    
    await videoModel.addProductVideo(productId, {
      video_url: videoUrl,
      title: req.body.title || null,
      description: req.body.description || null,
      thumbnail_url: req.body.thumbnail_url || null,
      duration: req.body.duration ? parseInt(req.body.duration) : null,
      is_primary: isPrimary
    })
    
    res.status(201).json({ message: 'Video uploaded successfully', video: videoUrl })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/admin/videos/:videoId
 * Update video metadata
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/videos/:videoId', async (req, res) => {
  try {
    const videoId = parseInt(req.params.videoId)
    if (isNaN(videoId) || videoId <= 0) {
      return res.status(400).json({ message: 'Invalid video ID' })
    }
    
    const video = await productMediaModel.getProductVideoById(videoId)
    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }
    
    const updated = await productMediaModel.updateProductVideo(videoId, {
      title: req.body.title,
      description: req.body.description,
      thumbnail_url: req.body.thumbnail_url,
      duration: req.body.duration,
      is_primary: req.body.is_primary
    })
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update video' })
    }
    
    const updatedVideo = await productMediaModel.getProductVideoById(videoId)
    res.json(updatedVideo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * DELETE /api/admin/videos/:videoId
 * Delete video from S3/local and DB
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/videos/:videoId', async (req, res) => {
  try {
    const videoId = parseInt(req.params.videoId)
    if (isNaN(videoId) || videoId <= 0) {
      return res.status(400).json({ message: 'Invalid video ID' })
    }
    
    const video = await videoModel.getProductVideoById(videoId)
    if (!video) {
      return res.status(404).json({ message: 'Video not found' })
    }
    
    const useS3 = process.env.USE_AWS_S3 === 'true'
    if (useS3 && video.video_url) {
      try {
        await deleteFile(video.video_url)
      } catch (error) {
        // Continue with DB deletion
      }
    }
    
    const deleted = await videoModel.deleteProductVideo(videoId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete video' })
    }
    
    res.json({ message: 'Video deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * POST /api/admin/products/:productId/videos/:videoId/set-primary
 * Set primary video
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/:productId/videos/:videoId/set-primary', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId)
    const videoId = parseInt(req.params.videoId)
    
    if (isNaN(productId) || productId <= 0 || isNaN(videoId) || videoId <= 0) {
      return res.status(400).json({ message: 'Invalid product or video ID' })
    }
    
    const updated = await videoModel.setPrimaryVideo(productId, videoId)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to set primary video' })
    }
    
    res.json({ message: 'Primary video set successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
