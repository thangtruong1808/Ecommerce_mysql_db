/**
 * Product Carousel Component
 * Multi-slide carousel with infinite loop for displaying products
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useRef, useEffect } from 'react'
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
 * @date 2025-12-12
 */
const ProductCarousel = ({ products = [], onAddToCart, slidesToShow = 5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  const [itemsPerView, setItemsPerView] = useState(slidesToShow)

  /**
   * Update items per view based on screen size
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerView(1)
      else if (width < 768) setItemsPerView(2)
      else if (width < 1024) setItemsPerView(3)
      else if (width < 1280) setItemsPerView(4)
      else setItemsPerView(5)
    }
    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  /**
   * Handle previous slide
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const step = Math.min(itemsPerView, products.length)
      if (step >= products.length) return 0
      const newIndex = prev - step
      return newIndex < 0 ? products.length - (products.length % step || step) : newIndex
    })
  }

  /**
   * Handle next slide
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleNext = () => {
    setCurrentIndex((prev) => {
      const step = Math.min(itemsPerView, products.length)
      if (step >= products.length) return 0
      const newIndex = prev + step
      return newIndex >= products.length ? 0 : newIndex
    })
  }

  if (products.length === 0) return null

  // For fewer products, use flex layout with same card size as carousel
  if (products.length <= 4) {
    // Calculate card width to match carousel (each card is 100/itemsPerView %)
    const cardWidthPercent = 100 / itemsPerView

    /* Product flex layout for small number of products */
    return (
      <div className="flex flex-wrap">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-shrink-0"
            style={{ width: `${cardWidthPercent}%` }}
          >
            <div className="px-2">
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Duplicate products for seamless infinite loop
  const duplicatedProducts = [...products, ...products, ...products]
  const visibleCount = Math.min(itemsPerView, products.length)
  const itemWidth = 100 / visibleCount
  const baseOffset = products.length * itemWidth

  /* Product carousel with multi-slide */
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
            transform: `translateX(-${baseOffset + (currentIndex % products.length) * itemWidth}%)`
          }}
        >
          {duplicatedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0"
              style={{ width: `${itemWidth}%` }}
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
