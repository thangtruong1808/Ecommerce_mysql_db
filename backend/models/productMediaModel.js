/**
 * Product Media Model
 * Re-exports image and video model functions for backward compatibility
 * @author Thang Truong
 * @date 2025-12-12
 */

import * as imageModel from './imageModel.js'
import * as videoModel from './videoModel.js'

// Re-export all functions for backward compatibility
export const addProductImage = imageModel.addProductImage
export const getProductImages = imageModel.getProductImages
export const getProductsImages = imageModel.getProductsImages
export const getProductImageById = imageModel.getProductImageById
export const updateProductImage = imageModel.updateProductImage
export const deleteProductImage = imageModel.deleteProductImage
export const setPrimaryImage = imageModel.setPrimaryImage
export const getAllImages = imageModel.getAllImages

export const addProductVideo = videoModel.addProductVideo
export const getProductVideos = videoModel.getProductVideos
export const getProductVideoById = videoModel.getProductVideoById
export const updateProductVideo = videoModel.updateProductVideo
export const deleteProductVideo = videoModel.deleteProductVideo
export const setPrimaryVideo = videoModel.setPrimaryVideo
export const getAllVideos = videoModel.getAllVideos
