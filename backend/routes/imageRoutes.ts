/**
 * Image Routes
 * Handles CRUD operations for product images
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import type { Request, Response, NextFunction } from "express";
import express from 'express'
import * as imageModel from '../models/imageModel.js'
import * as productMediaModel from '../models/productMediaModel.js'
import * as productModel from '../models/productModel.js'
import { uploadImage } from '../middleware/uploadMiddleware.js'
import { uploadImageWithResize, deleteFile } from '../utils/s3Service.js'
import path from 'path'
import fs from 'fs'

const router = express.Router()

// All routes require admin authentication (applied in mediaRoutes.js)

/**
 * GET /api/admin/products/:productId/images
 * Get all images for a product
 * @author Thang Truong
 * @date 2025-12-12
 */
router.get('/products/:productId/images', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    const images = await imageModel.getProductImages(productId)
    res.json(images)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * POST /api/admin/products/:productId/images
 * Upload image(s) to S3 or local storage
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/:productId/images', uploadImage.array('images', 10), async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId)
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }
    
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
        imageUrl = await uploadImageWithResize(file.buffer, file.originalname, productId)
      } else {
        const { resizeImage } = await import('../middleware/uploadMiddleware.js')
        const uploadsDir = path.join(process.cwd(), 'backend', 'uploads', 'images')
        const originalPath = file.path
        const resizedPath = path.join(uploadsDir, `resized-${file.filename}`)
        await resizeImage(originalPath, resizedPath)
        if (fs.existsSync(resizedPath)) {
          fs.renameSync(resizedPath, originalPath)
        }
        imageUrl = `/uploads/images/${file.filename}`
      }
      
      await productMediaModel.addProductImage(productId, imageUrl, isPrimary)
      imageUrls.push(imageUrl)
    }
    
    res.status(201).json({ message: 'Images uploaded successfully', images: imageUrls })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * PUT /api/admin/images/:imageId
 * Update image metadata
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/images/:imageId', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId)
    if (isNaN(imageId) || imageId <= 0) {
      return res.status(400).json({ message: 'Invalid image ID' })
    }
    
    const image = await imageModel.getProductImageById(imageId)
    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }
    
    const updated = await imageModel.updateProductImage(imageId, {
      is_primary: req.body.is_primary
    })
    
    if (!updated) {
      return res.status(400).json({ message: 'Failed to update image' })
    }
    
    const updatedImage = await imageModel.getProductImageById(imageId)
    res.json(updatedImage)
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * DELETE /api/admin/images/:imageId
 * Delete image from S3/local and DB
 * @author Thang Truong
 * @date 2025-12-12
 */
router.delete('/images/:imageId', async (req: Request, res: Response) => {
  try {
    const imageId = parseInt(req.params.imageId)
    if (isNaN(imageId) || imageId <= 0) {
      return res.status(400).json({ message: 'Invalid image ID' })
    }
    
    const image = await imageModel.getProductImageById(imageId)
    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }
    
    const useS3 = process.env.USE_AWS_S3 === 'true'
    if (useS3 && image.image_url) {
      try {
        await deleteFile(image.image_url)
      } catch (error: unknown) {
        // Continue with DB deletion
      }
    }
    
    const deleted = await imageModel.deleteProductImage(imageId)
    if (!deleted) {
      return res.status(400).json({ message: 'Failed to delete image' })
    }
    
    res.json({ message: 'Image deleted successfully' })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

/**
 * POST /api/admin/products/:productId/images/:imageId/set-primary
 * Set primary image
 * @author Thang Truong
 * @date 2025-12-12
 */
router.post('/products/:productId/images/:imageId/set-primary', async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.productId)
    const imageId = parseInt(req.params.imageId)
    
    if (isNaN(productId) || productId <= 0 || isNaN(imageId) || imageId <= 0) {
      return res.status(400).json({ message: 'Invalid product or image ID' })
    }
    
    const updated = await imageModel.setPrimaryImage(productId, imageId)
    if (!updated) {
      return res.status(400).json({ message: 'Failed to set primary image' })
    }
    
    res.json({ message: 'Primary image set successfully' })
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) })
  }
})

export default router
