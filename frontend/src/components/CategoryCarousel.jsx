/**
 * Category Carousel Component
 * Displays categories in a carousel with horizontal thumbnails and infinite loop
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

/**
 * CategoryCarousel component
 * @param {Object} props - Component props
 * @param {Array} props.categories - Array of category objects
 * @returns {JSX.Element} Category carousel component
 * @author Thang Truong
 * @date 2025-12-12
 */
const CategoryCarousel = ({ categories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)
  const carouselRef = useRef(null)

  /**
   * Auto-play carousel
   * @author Thang Truong
   * @date 2025-12-12
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
   * @date 2025-12-12
   */
  const handleThumbClick = (index) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  /**
   * Handle previous category
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  /**
   * Handle next category
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  if (categories.length === 0) return null

  const currentCategory = categories[currentIndex]

  /* Category carousel with horizontal thumbs */
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main carousel display */}
      <div className="w-full bg-white rounded-lg shadow-md p-8" ref={carouselRef}>
        <Link
          to={`/products?category=${currentCategory.id}`}
          className="block w-full h-full hover:opacity-90 transition"
        >
          <div className="flex flex-col items-center justify-center h-full text-center min-h-[200px]">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{currentCategory.name}</h3>
            {currentCategory.description && (
              <p className="text-gray-600 mb-4">{currentCategory.description}</p>
            )}
            <span className="text-blue-600 font-semibold hover:underline">
              Shop {currentCategory.name} →
            </span>
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
          {categories.map((category, index) => (
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
              <div className="text-2xl mb-1">📦</div>
              <div className="text-xs font-medium truncate">{category.name}</div>
            </button>
          ))}
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
