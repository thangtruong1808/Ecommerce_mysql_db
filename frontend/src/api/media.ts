import type {
  ImageUploadResult,
  ProductImage,
  ProductMedia,
  ProductVideo,
  VideoUploadMetadata,
  VideoUploadResult,
} from "@shared/index";
import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export const getProductMedia = (productId: number) =>
  apiGet<ProductMedia>(`/api/admin/products/${productId}/media`);

export const getProductImages = (productId: number) =>
  apiGet<ProductImage[]>(`/api/admin/products/${productId}/images`);

export const getProductVideos = (productId: number) =>
  apiGet<ProductVideo[]>(`/api/admin/products/${productId}/videos`);

export const uploadProductImages = async (productId: number, files: FileList | File[]) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("images", file);
  });
  const data = await apiPost<ImageUploadResult>(
    `/api/admin/products/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.images;
};

export const uploadProductVideo = async (
  productId: number,
  file: File,
  metadata: VideoUploadMetadata = {}
) => {
  const formData = new FormData();
  formData.append("video", file);
  if (metadata.title) formData.append("title", metadata.title);
  if (metadata.description) formData.append("description", metadata.description);
  if (metadata.thumbnail_url) formData.append("thumbnail_url", metadata.thumbnail_url);
  if (metadata.duration) formData.append("duration", String(metadata.duration));
  const data = await apiPost<VideoUploadResult>(
    `/api/admin/products/${productId}/videos`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.video;
};

export const updateImage = (imageId: number, data: Partial<Pick<ProductImage, "is_primary">>) =>
  apiPut<ProductImage>(`/api/admin/images/${imageId}`, data);

export const updateVideo = (
  videoId: number,
  data: Partial<Pick<ProductVideo, "title" | "description" | "thumbnail_url" | "duration" | "is_primary">>
) => apiPut<ProductVideo>(`/api/admin/videos/${videoId}`, data);

export const deleteImage = (imageId: number) =>
  apiDelete(`/api/admin/images/${imageId}`);

export const deleteVideo = (videoId: number) =>
  apiDelete(`/api/admin/videos/${videoId}`);

export const setPrimaryImage = (productId: number, imageId: number) =>
  apiPost<unknown>(`/api/admin/products/${productId}/images/${imageId}/set-primary`);

export const setPrimaryVideo = (productId: number, videoId: number) =>
  apiPost<unknown>(`/api/admin/products/${productId}/videos/${videoId}/set-primary`);

export const bulkDeleteMedia = (productId: number, imageIds: number[] = [], videoIds: number[] = []) =>
  apiDelete(`/api/admin/products/${productId}/media/bulk`, {
    data: { imageIds, videoIds },
  });
