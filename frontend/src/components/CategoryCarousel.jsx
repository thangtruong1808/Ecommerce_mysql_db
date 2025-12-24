/**
 * Category Carousel Component
 * Displays categories in a carousel with horizontal thumbnails and infinite loop
 * Shows category photos if available, otherwise displays emoji placeholder
 * @author Thang Truong
 * @date 2025-01-28
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

/**
 * Get category photo URL
 * @param {string|null} photoUrl - Category photo URL
 * @returns {string|null} Full photo URL or null
 * @author Thang Truong
 * @date 2025-01-28
 */
const getCategoryPhotoUrl = (photoUrl) => {
  if (!photoUrl) return null
  if (photoUrl.startsWith('http')) return photoUrl
  return `${window.location.origin}${photoUrl}`
}

/**
 * CategoryCarousel component
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of category objects
 * @returns {JSX.Element} Category carousel component
 * @author Thang Truong
 * @date 2025-01-28
 */
const CategoryCarousel = ({ categories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [imageErrors, setImageErrors] = useState(new Set())
  const intervalRef = useRef(null)
  const carouselRef = useRef(null)

  /**
   * Auto-play carousel
   * @author Thang Truong
   * @date 2025-01-28
   */
  useEffect(() => {
    if (categories.length === 0 || !isAutoPlaying) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length)
    }, 3000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [categories.length, isAutoPlaying])

  /**
   * Handle thumbnail click
   * @param {number} index - Category index
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleThumbClick = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  /**
   * Handle previous category
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  /**
   * Handle next category
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  /**
   * Handle image load error
   * @param {string} categoryId - Category ID
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleImageError = (categoryId) => {
    setImageErrors(prev => new Set(prev).add(categoryId))
  }

  if (categories.length === 0) return null

  const currentCategory = categories[currentIndex]
  const currentPhotoUrl = getCategoryPhotoUrl(currentCategory.photo_url)
  const showCurrentPhoto = currentPhotoUrl && !imageErrors.has(currentCategory.id)

  /* Category carousel with horizontal thumbs */
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main carousel display */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden" ref={carouselRef}>
        <Link
          to={`/products?category=${currentCategory.id}`}
          className="block w-full h-auto hover:opacity-90 transition"
        >
          <div className="w-full h-auto flex overflow-hidden">
            {/* Image column */}
            <div className="max-w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden ">
              {showCurrentPhoto ? (
                <img
                  src={currentPhotoUrl}
                  alt={currentCategory.name}
                  className="max-w-full max-h-full object-stretch"
                  loading="eager"
                  decoding="async"
                  onError={() => handleImageError(currentCategory.id)}
                />
              ) : (
                <div className="text-6xl">📦</div>
              )}
            </div>
            
            {/* Text column */}
            <div className="max-w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{currentCategory.name}</h3>
              {currentCategory.description && (
                <p className="text-gray-600 mb-4">{currentCategory.description}</p>
              )}
              <span className="text-blue-600 font-semibold hover:underline">
                Shop {currentCategory.name} →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Horizontal thumbnails */}
      <div className="w-full flex items-center gap-2">
        <button
          onClick={handlePrevious}
          className="flex-shrink-0 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
          aria-label="Previous category"
        >
          <FaChevronLeft />
        </button>
        <div className="flex-1 flex gap-2">
          {categories.map((category, index) => {
            const thumbPhotoUrl = getCategoryPhotoUrl(category.photo_url)
            const showThumbPhoto = thumbPhotoUrl && !imageErrors.has(category.id)
            return (
              <button
                key={category.id}
                onClick={() => handleThumbClick(index)}
                className={`flex-1 p-3 rounded-lg transition text-center ${
                  index === currentIndex
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label={`View ${category.name}`}
              >
                {showThumbPhoto ? (
                  <img
                    src={thumbPhotoUrl}
                    alt={category.name}
                    className="w-8 h-8 object-cover rounded mx-auto mb-1"
                    onError={() => handleImageError(category.id)}
                  />
                ) : (
                  <div className="text-2xl mb-1">📦</div>
                )}
                <div className="text-xs font-medium truncate">{category.name}</div>
              </button>
            )
          })}
        </div>
        <button
          onClick={handleNext}
          className="flex-shrink-0 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
          aria-label="Next category"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  )
}

export default CategoryCarousel
