/**
 * Media Gallery Component
 * Grid view of images with primary badge and quick actions
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'
import { FaStar, FaTrash, FaEye } from 'react-icons/fa'

/**
 * MediaGallery component
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects
 * @param {Function} props.onSetPrimary - Set primary callback (imageId)
 * @param {Function} props.onDelete - Delete callback (imageId)
 * @returns {JSX.Element} Media gallery component
 * @author Thang Truong
 * @date 2025-12-12
 */
const MediaGallery = ({ images = [], onSetPrimary, onDelete }) => {
  const [lightboxImage, setLightboxImage] = useState(null)

  /**
   * Get image URL
   * @param {string} url - Image URL
   * @returns {string} Full image URL
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getImageUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `${window.location.origin}${url}`
  }

  /* Media gallery component */
  return (
    <>
      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No images available
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group border rounded-lg overflow-hidden bg-gray-100"
            >
              {/* Image */}
              <img
                src={getImageUrl(image.image_url)}
                alt={`Product image ${image.id}`}
                className="w-full h-32 object-cover"
              />
              
              {/* Primary badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1 text-xs">
                  <FaStar className="text-xs" />
                  Primary
                </div>
              )}
              
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setLightboxImage(image)}
                  className="bg-white text-gray-800 p-2 rounded hover:bg-gray-100"
                  aria-label="View image"
                >
                  <FaEye />
                </button>
                {!image.is_primary && (
                  <button
                    onClick={() => onSetPrimary?.(image.id)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    aria-label="Set as primary"
                  >
                    <FaStar />
                  </button>
                )}
                <button
                  onClick={() => onDelete?.(image.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  aria-label="Delete image"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={getImageUrl(lightboxImage.image_url)}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default MediaGallery
