/**
 * AWS S3 Service
 * Handles file uploads, deletions, and URL generation for S3 storage
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ''
const BUCKET_URL = process.env.AWS_S3_BUCKET_URL || ''

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type
 * @param {string} folder - Folder path (e.g., 'images', 'videos')
 * @returns {Promise<string>} S3 file URL
 * @author Thang Truong
 * @date 2025-12-12
 */
export const uploadFile = async (fileBuffer, fileName, contentType, folder) => {
  try {
    const key = `${folder}/${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType
    })
    
    await s3Client.send(command)
    
    // Return full S3 URL
    const url = BUCKET_URL 
      ? `${BUCKET_URL}/${key}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
    
    return url
  } catch (error) {
    throw new Error(`Failed to upload file to S3: ${error.message}`)
  }
}

/**
 * Upload image with resize to S3
 * @param {Buffer} fileBuffer - Image buffer
 * @param {string} fileName - File name
 * @param {number} productId - Product ID for folder structure
 * @returns {Promise<string>} S3 file URL
 * @author Thang Truong
 * @date 2025-12-12
 */
export const uploadImageWithResize = async (fileBuffer, fileName, productId) => {
  try {
    // Resize image to 500x500
    const resizedBuffer = await sharp(fileBuffer)
      .resize(500, 500, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer()
    
    const timestamp = Date.now()
    const key = `images/${productId}/${timestamp}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: resizedBuffer,
      ContentType: 'image/jpeg'
    })
    
    await s3Client.send(command)
    
    // Return full S3 URL
    const url = BUCKET_URL 
      ? `${BUCKET_URL}/${key}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
    
    return url
  } catch (error) {
    throw new Error(`Failed to upload and resize image to S3: ${error.message}`)
  }
}

/**
 * Delete file from S3
 * @param {string} fileKey - S3 file key or full URL
 * @returns {Promise<void>}
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteFile = async (fileKey) => {
  try {
    // Extract key from URL if full URL is provided
    let key = fileKey
    if (fileKey.includes('amazonaws.com/') || fileKey.includes(BUCKET_URL)) {
      const urlParts = fileKey.split('.com/')
      if (urlParts.length > 1) {
        key = urlParts[1]
      } else {
        const urlParts2 = fileKey.split(BUCKET_URL + '/')
        if (urlParts2.length > 1) {
          key = urlParts2[1]
        }
      }
    }
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    })
    
    await s3Client.send(command)
  } catch (error) {
    throw new Error(`Failed to delete file from S3: ${error.message}`)
  }
}

/**
 * Get file URL from S3 key
 * @param {string} fileKey - S3 file key
 * @returns {string} Full S3 URL
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getFileUrl = (fileKey) => {
  if (!fileKey) return ''
  
  // If already a full URL, return as-is
  if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
    return fileKey
  }
  
  // Construct URL from key
  return BUCKET_URL 
    ? `${BUCKET_URL}/${fileKey}`
    : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`
}

/**
 * Upload video to S3
 * @param {Buffer} fileBuffer - Video buffer
 * @param {string} fileName - File name
 * @param {string} contentType - MIME type
 * @param {number} productId - Product ID for folder structure
 * @returns {Promise<string>} S3 file URL
 * @author Thang Truong
 * @date 2025-12-12
 */
export const uploadVideo = async (fileBuffer, fileName, contentType, productId) => {
  try {
    const timestamp = Date.now()
    const key = `videos/${productId}/${timestamp}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType
    })
    
    await s3Client.send(command)
    
    // Return full S3 URL
    const url = BUCKET_URL 
      ? `${BUCKET_URL}/${key}`
      : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
    
    return url
  } catch (error) {
    throw new Error(`Failed to upload video to S3: ${error.message}`)
  }
}
