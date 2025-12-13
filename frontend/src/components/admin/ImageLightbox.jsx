/**
 * Image Lightbox Component
 * Full-size image viewer modal
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * ImageLightbox component
 * @param {Object} props - Component props
 * @param {Object} props.image - Image object
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Image lightbox component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ImageLightbox = ({ image, onClose }) => {
  if (!image) return null

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

  /* Image lightbox */
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-full">
        <img
          src={getImageUrl(image.image_url)}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default ImageLightbox
