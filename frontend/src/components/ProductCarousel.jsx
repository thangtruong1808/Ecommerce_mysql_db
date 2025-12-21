/**
 * Product Carousel Component
 * Carousel with navigation buttons and CSS-only responsive sizing
 * No JavaScript resize handlers for fast performance
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useRef } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ProductCard from './ProductCard'

/**
 * ProductCarousel component
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of product objects
 * @param {Function} props.onAddToCart - Add to cart handler
 * @param {number} props.slidesToShow - Number of products to show at once (default: 5)
 * @returns {JSX.Element} Product carousel component
 * @author Thang Truong
 * @date 2025-12-17
 */
const ProductCarousel = ({ products = [], onAddToCart, slidesToShow = 5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  /**
   * Handle previous slide
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  /**
   * Handle next slide
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  if (products.length === 0) return null

  // If 5 or fewer products, display as grid (same as Clearance page) - no carousel needed
  if (products.length <= 5) {
    /* Product grid for 5 or fewer items - no carousel navigation */
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    )
  }

  // Use CSS responsive classes for item widths - no JavaScript resize handlers needed
  // Transform moves by 100% of each item's width, CSS handles responsive sizing automatically
  /* Product carousel with navigation buttons and CSS-only responsive sizing */
  return (
    <div className="w-full relative">
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
        aria-label="Previous products"
      >
        <FaChevronLeft />
      </button>

      <div className="overflow-hidden px-10">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            willChange: 'transform'
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
            >
              <div className="px-2">
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
        aria-label="Next products"
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default ProductCarousel
