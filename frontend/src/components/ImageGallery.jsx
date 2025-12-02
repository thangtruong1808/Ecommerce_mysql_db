/**
 * Image Gallery Component
 * Displays product images with thumbnail navigation
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState } from 'react'

/**
 * ImageGallery component
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects with image_url
 * @returns {JSX.Element} Image gallery component
 */
const ImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  /**
   * Handle thumbnail click
   * @param {number} index - Image index
   */
  const handleThumbnailClick = (index) => {
    setSelectedIndex(index)
  }

  if (!images || images.length === 0) {
    return (
      <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        {/* No image placeholder */}
        <p className="text-gray-500">No image available</p>
      </div>
    )
  }

  const primaryImage = images.find(img => img.is_primary) || images[0]
  const displayImage = images[selectedIndex] || primaryImage

  return (
    <div>
      {/* Main image display */}
      <div className="h-96 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
        {displayImage?.image_url ? (
          <img
            src={displayImage.image_url}
            alt="Product"
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-gray-500">No image available</p>
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {/* Thumbnail grid */}
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => handleThumbnailClick(index)}
              className={`h-20 rounded overflow-hidden border-2 ${
                selectedIndex === index
                  ? 'border-blue-600'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {image.image_url ? (
                <img
                  src={image.image_url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery

