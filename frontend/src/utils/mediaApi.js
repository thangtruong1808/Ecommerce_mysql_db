/**
 * Media API Utilities
 * Toast handling stays here. Requests go through the typed client.
 */

import { toast } from "react-toastify";
import * as media from "../api/media.ts";
import { shouldSuppress401Toast } from "./authUtils";

const reportError = (error, fallback) => {
  const message = error.response?.data?.message || fallback;
  if (!shouldSuppress401Toast(error)) {
    toast.error(message);
  }
};

export const getProductMedia = async (productId) => {
  try {
    return await media.getProductMedia(productId);
  } catch (error) {
    reportError(error, "Failed to load media");
    throw error;
  }
};

export const getProductImages = async (productId) => {
  try {
    return await media.getProductImages(productId);
  } catch (error) {
    reportError(error, "Failed to load images");
    throw error;
  }
};

export const getProductVideos = async (productId) => {
  try {
    return await media.getProductVideos(productId);
  } catch (error) {
    reportError(error, "Failed to load videos");
    throw error;
  }
};

export const uploadProductImages = async (productId, files) => {
  try {
    const images = await media.uploadProductImages(productId, files);
    toast.success("Images uploaded successfully");
    return images;
  } catch (error) {
    reportError(error, "Failed to upload images");
    throw error;
  }
};

export const uploadProductVideo = async (productId, file, metadata = {}) => {
  try {
    const video = await media.uploadProductVideo(productId, file, metadata);
    toast.success("Video uploaded successfully");
    return video;
  } catch (error) {
    reportError(error, "Failed to upload video");
    throw error;
  }
};

export const updateImage = async (imageId, data) => {
  try {
    const image = await media.updateImage(imageId, data);
    toast.success("Image updated successfully");
    return image;
  } catch (error) {
    reportError(error, "Failed to update image");
    throw error;
  }
};

export const updateVideo = async (videoId, data) => {
  try {
    const video = await media.updateVideo(videoId, data);
    toast.success("Video updated successfully");
    return video;
  } catch (error) {
    reportError(error, "Failed to update video");
    throw error;
  }
};

export const deleteImage = async (imageId) => {
  try {
    await media.deleteImage(imageId);
    toast.success("Image deleted successfully");
  } catch (error) {
    reportError(error, "Failed to delete image");
    throw error;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    await media.deleteVideo(videoId);
    toast.success("Video deleted successfully");
  } catch (error) {
    reportError(error, "Failed to delete video");
    throw error;
  }
};

export const setPrimaryImage = async (productId, imageId) => {
  try {
    await media.setPrimaryImage(productId, imageId);
    toast.success("Primary image set successfully");
  } catch (error) {
    reportError(error, "Failed to set primary image");
    throw error;
  }
};

export const setPrimaryVideo = async (productId, videoId) => {
  try {
    await media.setPrimaryVideo(productId, videoId);
    toast.success("Primary video set successfully");
  } catch (error) {
    reportError(error, "Failed to set primary video");
    throw error;
  }
};

export const bulkDeleteMedia = async (productId, imageIds = [], videoIds = []) => {
  try {
    await media.bulkDeleteMedia(productId, imageIds, videoIds);
    toast.success("Media deleted successfully");
  } catch (error) {
    reportError(error, "Failed to delete media");
    throw error;
  }
};
