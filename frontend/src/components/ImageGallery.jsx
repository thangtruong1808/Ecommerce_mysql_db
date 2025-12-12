/**
 * Image Gallery Component
 * Displays product images with thumbnail navigation
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'
import comingSoon from '../assets/images/image_comming_soon.png'

/**
 * ImageGallery component
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects with image_url
 * @returns {JSX.Element} Image gallery component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ImageGallery = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState({})

  /**
   * Handle thumbnail click
   * @param {number} index - Image index
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleThumbnailClick = (index) => {
    setSelectedIndex(index)
  }

  /**
   * Handle image error
   * @param {string} imageId - Image ID or index
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleImageError = (imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }))
  }

  /**
   * Get primary image URL
   * @returns {string|null} Primary image URL or null
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getPrimaryImage = () => {
    if (images && images.length > 0) {
      const primary = images.find(img => img.is_primary)
      return primary?.image_url || images[0]?.image_url || null
    }
    return null
  }

  const primaryImageUrl = getPrimaryImage()
  const displayImage = images[selectedIndex] || images[0]
  const displayImageUrl = displayImage?.image_url || primaryImageUrl
  const hasValidImages = images.some(img => img.image_url)

  if (!images || images.length === 0 || !hasValidImages) {
    return (
      /* No images available */
      <div className="w-full max-w-[500px] aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
        <img src={comingSoon} alt="Coming soon" className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    /* Image gallery container */
    <div>
      {/* Main image display - 500x500 resolution */}
      <div className="w-full max-w-[500px] aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
        {displayImageUrl && !imageErrors[selectedIndex] ? (
          <img
            src={displayImageUrl}
            alt="Product"
            className="w-full h-full object-cover"
            onError={(e) => {
              if (e.target.src !== comingSoon) {
                e.target.src = comingSoon
                handleImageError(selectedIndex)
              }
            }}
          />
        ) : (
          <img src={comingSoon} alt="Coming soon" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => {
            const imageUrl = image.image_url && !imageErrors[image.id || index] ? image.image_url : comingSoon
            return (
              <button
                key={image.id || index}
                onClick={() => handleThumbnailClick(index)}
                className={`h-20 rounded overflow-hidden border-2 ${
                  selectedIndex === index
                    ? 'border-blue-600'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(image.id || index)}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
