import type { ProductImage, ProductVideo } from "./catalog";

/**
 * S3 helpers return this public URL string. The same string is stored in
 * image_url or video_url. Local uploads use a `/uploads/...` path instead.
 */
export type StoredFileUrl = string;

/** Key layout used by the S3 service. Not returned as its own JSON body. */
export interface S3ObjectLocation {
  key: string;
  url: StoredFileUrl;
  folder: "images" | "videos" | "categories" | "subcategories";
}

export interface ProductMedia {
  images: ProductImage[];
  videos: ProductVideo[];
}

export interface ImageUploadResult {
  message: string;
  images: StoredFileUrl[];
}

export interface VideoUploadResult {
  message: string;
  video: StoredFileUrl;
}

export interface VideoUploadMetadata {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  duration?: number | string;
}
