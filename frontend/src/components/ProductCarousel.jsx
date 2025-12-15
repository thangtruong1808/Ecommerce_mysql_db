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
  const containerRef = useRef(null)
  const [itemsPerView, setItemsPerView] = useState(slidesToShow)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)

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

  /**
   * Get client X position from event
   * @param {Event} e - Mouse or touch event
   * @returns {number} Client X position
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getClientX = (e) => {
    return e.touches ? e.touches[0].clientX : e.clientX
  }

  /**
   * Handle drag start
   * @param {Event} e - Mouse or touch event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDragStart = (e) => {
    setIsDragging(true)
    const clientX = getClientX(e)
    setStartX(clientX)
    setCurrentX(clientX)
    setDragOffset(0)
  }

  /**
   * Handle drag move
   * @param {Event} e - Mouse or touch event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDragMove = (e) => {
    if (!isDragging || startX === 0) return
    e.preventDefault()
    const clientX = getClientX(e)
    setCurrentX(clientX)
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const offset = ((clientX - startX) / containerWidth) * 100
      setDragOffset(offset)
    }
  }

  /**
   * Handle drag end
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const visibleCount = Math.min(itemsPerView, products.length)
    const itemWidth = 100 / visibleCount
    const threshold = itemWidth * 0.3

    if (Math.abs(dragOffset) > threshold) {
      const step = Math.min(itemsPerView, products.length)
      if (dragOffset > 0) {
        setCurrentIndex((prev) => {
          const newIndex = prev - step
          return newIndex < 0 ? products.length - (products.length % step || step) : newIndex
        })
      } else {
        setCurrentIndex((prev) => {
          const newIndex = prev + step
          return newIndex >= products.length ? 0 : newIndex
        })
      }
    }
    setDragOffset(0)
    setStartX(0)
    setCurrentX(0)
  }

  if (products.length === 0) return null

  // Duplicate products for seamless infinite loop
  const duplicatedProducts = [...products, ...products, ...products]
  const visibleCount = Math.min(itemsPerView, products.length)
  const itemWidth = 100 / visibleCount
  const baseOffset = products.length * itemWidth
  const translateX = baseOffset + (currentIndex % products.length) * itemWidth + dragOffset

  /* Product carousel with multi-slide and draggable */
  return (
    <div className="w-full relative">
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition"
        aria-label="Previous products"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={containerRef}
        className="overflow-hidden px-10 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          ref={carouselRef}
          className="flex"
          style={{
            transform: `translateX(-${translateX}%)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
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
