/**
 * Media Management Page
 * Full CRUD operations for product images and videos
 *
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaImages } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import MediaUploader from "../../components/admin/MediaUploader";
import MediaGallery from "../../components/admin/MediaGallery";
import VideoList from "../../components/admin/VideoList";
import SkeletonLoader from "../../components/SkeletonLoader";
import {
  getProductMedia,
  uploadProductImages,
  uploadProductVideo,
  deleteImage,
  deleteVideo,
  setPrimaryImage,
  setPrimaryVideo,
  updateVideo,
} from "../../utils/mediaApi";
import usePageTitle from "../../hooks/usePageTitle";

/**
 * MediaManagement component
 * @returns {JSX.Element} Media management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const MediaManagement = () => {
  usePageTitle(loading ? "Loading..." : "Media Management");

  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("images");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [product, setProduct] = useState(null);
  const [editVideo, setEditVideo] = useState(null);

  /**
   * Fetch product and media
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productRes, mediaRes] = await Promise.all([
        axios.get(`/api/products/${productId}`),
        getProductMedia(productId),
      ]);
      setProduct(productRes.data);
      setImages(mediaRes.images || []);
      setVideos(mediaRes.videos || []);
    } catch (error) {
      toast.error("Failed to load product media");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  /**
   * Handle image upload
   * @param {Array} files - Image files
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleImageUpload = async (files) => {
    try {
      await uploadProductImages(productId, files);
      fetchData();
    } catch (error) {
      // Error handled in API
    }
  };

  /**
   * Handle video upload
   * @param {Array} files - Video files
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleVideoUpload = async (files) => {
    try {
      await uploadProductVideo(productId, files[0]);
      fetchData();
    } catch (error) {
      // Error handled in API
    }
  };

  /**
   * Handle image delete
   * @param {number} imageId - Image ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleImageDelete = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(imageId);
        fetchData();
      } catch (error) {
        // Error handled in API
      }
    }
  };

  /**
   * Handle video delete
   * @param {number} videoId - Video ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleVideoDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(videoId);
        fetchData();
      } catch (error) {
        // Error handled in API
      }
    }
  };

  /**
   * Handle set primary image
   * @param {number} imageId - Image ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSetPrimaryImage = async (imageId) => {
    try {
      await setPrimaryImage(productId, imageId);
      fetchData();
    } catch (error) {
      // Error handled in API
    }
  };

  /**
   * Handle set primary video
   * @param {number} videoId - Video ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSetPrimaryVideo = async (videoId) => {
    try {
      await setPrimaryVideo(productId, videoId);
      fetchData();
    } catch (error) {
      // Error handled in API
    }
  };

  /**
   * Handle video edit
   * @param {Object} video - Video object
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleVideoEdit = (video) => {
    setEditVideo(video);
  };

  /**
   * Handle video update
   * @param {Object} data - Update data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleVideoUpdate = async (data) => {
    try {
      await updateVideo(editVideo.id, data);
      setEditVideo(null);
      fetchData();
    } catch (error) {
      // Error handled in API
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    );
  }

  /* Media management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaImages className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">
              Media Management - {product?.name || "Product"}
            </h1>
          </div>
          {/* Back button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
            <button
              onClick={() => navigate("/admin/products")}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Products
            </button>
          </div>
        </div>

        {/* Divider between header and tabs */}
        <div className="my-2 mb-4">
          <hr />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("images")}
              className={`px-4 py-2 font-medium ${
                activeTab === "images"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Images ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`px-4 py-2 font-medium ${
                activeTab === "videos"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Videos ({videos.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === "images" ? (
          <div className="space-y-6">
            <MediaUploader
              onUpload={handleImageUpload}
              accept="image/*"
              maxSize={5}
              maxFiles={10}
              multiple={true}
            />
            <MediaGallery
              images={images}
              onSetPrimary={handleSetPrimaryImage}
              onDelete={handleImageDelete}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <MediaUploader
              onUpload={handleVideoUpload}
              accept="video/*"
              maxSize={100}
              maxFiles={1}
              multiple={false}
            />
            <VideoList
              videos={videos}
              onSetPrimary={handleSetPrimaryVideo}
              onDelete={handleVideoDelete}
              onEdit={handleVideoEdit}
            />
          </div>
        )}

        {/* Edit video modal */}
        {editVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Edit Video</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleVideoUpdate({
                    title: formData.get("title"),
                    description: formData.get("description"),
                    thumbnail_url: formData.get("thumbnail_url"),
                    duration: formData.get("duration")
                      ? parseInt(formData.get("duration"))
                      : null,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editVideo.title || ""}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editVideo.description || ""}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    name="thumbnail_url"
                    defaultValue={editVideo.thumbnail_url || ""}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    defaultValue={editVideo.duration || ""}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditVideo(null)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MediaManagement;
