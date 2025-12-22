/**
 * Media API Utilities
 * API functions for product media management (images and videos)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import axios from 'axios'
import { toast } from 'react-toastify'
import { shouldSuppress401Toast } from './authUtils.js'

/**
 * Get all media for a product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Media object with images and videos
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductMedia = async (productId) => {
  try {
    const response = await axios.get(`/api/admin/products/${productId}/media`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load media'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Get all images for a product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} Array of images
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductImages = async (productId) => {
  try {
    const response = await axios.get(`/api/admin/products/${productId}/images`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load images'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Get all videos for a product
 * @param {number} productId - Product ID
 * @returns {Promise<Array>} Array of videos
 * @author Thang Truong
 * @date 2025-12-12
 */
export const getProductVideos = async (productId) => {
  try {
    const response = await axios.get(`/api/admin/products/${productId}/videos`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to load videos'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Upload product images
 * @param {number} productId - Product ID
 * @param {FileList|Array} files - Image files
 * @returns {Promise<Array>} Array of uploaded image URLs
 * @author Thang Truong
 * @date 2025-12-12
 */
export const uploadProductImages = async (productId, files) => {
  try {
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('images', file)
    })
    
    const response = await axios.post(
      `/api/admin/products/${productId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    toast.success('Images uploaded successfully')
    return response.data.images
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to upload images'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Upload product video
 * @param {number} productId - Product ID
 * @param {File} file - Video file
 * @param {Object} metadata - Video metadata (title, description, thumbnail_url, duration)
 * @returns {Promise<string>} Uploaded video URL
 * @author Thang Truong
 * @date 2025-12-12
 */
export const uploadProductVideo = async (productId, file, metadata = {}) => {
  try {
    const formData = new FormData()
    formData.append('video', file)
    if (metadata.title) formData.append('title', metadata.title)
    if (metadata.description) formData.append('description', metadata.description)
    if (metadata.thumbnail_url) formData.append('thumbnail_url', metadata.thumbnail_url)
    if (metadata.duration) formData.append('duration', metadata.duration)
    
    const response = await axios.post(
      `/api/admin/products/${productId}/videos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    toast.success('Video uploaded successfully')
    return response.data.video
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to upload video'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Update image metadata
 * @param {number} imageId - Image ID
 * @param {Object} data - Update data (is_primary)
 * @returns {Promise<Object>} Updated image
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateImage = async (imageId, data) => {
  try {
    const response = await axios.put(`/api/admin/images/${imageId}`, data)
    toast.success('Image updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update image'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Update video metadata
 * @param {number} videoId - Video ID
 * @param {Object} data - Update data (title, description, thumbnail_url, duration, is_primary)
 * @returns {Promise<Object>} Updated video
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateVideo = async (videoId, data) => {
  try {
    const response = await axios.put(`/api/admin/videos/${videoId}`, data)
    toast.success('Video updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update video'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Delete image
 * @param {number} imageId - Image ID
 * @returns {Promise<void>}
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteImage = async (imageId) => {
  try {
    await axios.delete(`/api/admin/images/${imageId}`)
    toast.success('Image deleted successfully')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete image'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Delete video
 * @param {number} videoId - Video ID
 * @returns {Promise<void>}
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteVideo = async (videoId) => {
  try {
    await axios.delete(`/api/admin/videos/${videoId}`)
    toast.success('Video deleted successfully')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete video'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Set primary image
 * @param {number} productId - Product ID
 * @param {number} imageId - Image ID
 * @returns {Promise<void>}
 * @author Thang Truong
 * @date 2025-12-12
 */
export const setPrimaryImage = async (productId, imageId) => {
  try {
    await axios.post(`/api/admin/products/${productId}/images/${imageId}/set-primary`)
    toast.success('Primary image set successfully')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to set primary image'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Set primary video
 * @param {number} productId - Product ID
 * @param {number} videoId - Video ID
 * @returns {Promise<void>}
 * @author Thang Truong
 * @date 2025-12-12
 */
export const setPrimaryVideo = async (productId, videoId) => {
  try {
    await axios.post(`/api/admin/products/${productId}/videos/${videoId}/set-primary`)
    toast.success('Primary video set successfully')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to set primary video'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}

/**
 * Bulk delete media
 * @param {number} productId - Product ID
 * @param {Array<number>} imageIds - Array of image IDs
 * @param {Array<number>} videoIds - Array of video IDs
 * @returns {Promise<void>}
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkDeleteMedia = async (productId, imageIds = [], videoIds = []) => {
  try {
    await axios.delete(`/api/admin/products/${productId}/media/bulk`, {
      data: { imageIds, videoIds }
    })
    toast.success('Media deleted successfully')
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete media'
    // Suppress toast if 401 error will be handled by token refresh
    if (!shouldSuppress401Toast(error)) {
      toast.error(message)
    }
    throw error
  }
}
