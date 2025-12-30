/**
 * Upload Middleware
 * Handles file uploads for product images and videos using Multer
 * Resizes product images to 500x500 (1:1 aspect ratio) for optimal display
 * @author Thang Truong
 * @date 2025-12-12
 */

import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import os from 'os'

// Lazy load sharp for image resizing (optional - graceful fallback if not installed)
let sharpCache = null
const getSharp = async () => {
  if (sharpCache !== null) return sharpCache
  try {
    const sharpModule = await import('sharp')
    sharpCache = sharpModule.default
    return sharpCache
  } catch (error) {
    // Sharp not installed - return null
    sharpCache = false
    return null
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if using S3
const useS3 = process.env.USE_AWS_S3 === 'true'

// Define a writable directory for uploads.
// Use the OS's temporary directory for serverless environments like Vercel,
// otherwise use a local 'uploads' folder for development.
const uploadsDir =
  process.env.NODE_ENV === 'production' && !useS3
    ? path.join(os.tmpdir(), 'uploads')
    : path.join(__dirname, '../uploads')

// Create uploads directory if it doesn't exist and we are not using S3
if (!useS3 && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

/**
 * Resize image to 500x500 (1:1 aspect ratio) for product cards
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to save resized image
 * @returns {Promise<void>} Resolves when image is resized
 * @author Thang Truong
 * @date 2025-12-12
 */
const resizeImage = async (inputPath, outputPath) => {
  const sharp = await getSharp()

  if (!sharp) {
    // If sharp is not available, copy file as-is
    fs.copyFileSync(inputPath, outputPath)
    return
  }

  try {
    await sharp(inputPath)
      .resize(500, 500, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .png({ quality: 85 })
      .webp({ quality: 85 })
      .toFile(outputPath)
  } catch (error) {
    // If resizing fails, copy original file
    fs.copyFileSync(inputPath, outputPath)
  }
}

// Configure storage for images - memory for S3, disk for local
const imageStorage = useS3
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const dest = path.join(uploadsDir, 'images')
        // Ensure the destination directory exists
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname).toLowerCase()
        // Convert to jpeg for consistency after resizing
        const finalExt =
          ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp'
            ? '.jpg'
            : ext
        cb(null, `product-${uniqueSuffix}${finalExt}`)
      }
    })

// Configure storage for videos - memory for S3, disk for local
const videoStorage = useS3
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const dest = path.join(uploadsDir, 'videos')
        // Ensure the destination directory exists
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true })
        }
        cb(null, dest)
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`)
      }
    })

/**
 * File filter for images
 * @param {Object} req - Request object
 * @param {Object} file - File object
 * @param {Function} cb - Callback function
 */
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'))
  }
}

/**
 * File filter for videos
 * @param {Object} req - Request object
 * @param {Object} file - File object
 * @param {Function} cb - Callback function
 */
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|ogg|mov/
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('Only video files (mp4, webm, ogg, mov) are allowed'))
  }
}

// Create upload instances
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: imageFilter
})

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: videoFilter
})

/**
 * Export resize function for use in routes
 * @author Thang Truong
 * @date 2025-12-12
 */
export { resizeImage }
