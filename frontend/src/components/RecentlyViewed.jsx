/**
 * Recently Viewed Component
 * Displays recently viewed products for both authenticated and guest users
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaEye } from 'react-icons/fa'
import ProductCarousel from './ProductCarousel'
import SkeletonLoader from './SkeletonLoader'
import Button from './Button'

/**
 * RecentlyViewed component
 * @param {Object} props - Component props
 * @param {number} props.limit - Maximum number of items to display
 * @param {boolean} props.showTitle - Whether to show the title
 * @param {Function} props.onAddToCart - Add to cart handler
 * @returns {JSX.Element} Recently viewed component
 * @author Thang Truong
 * @date 2025-12-12
 */
const RecentlyViewed = ({ limit = 15, showTitle = true, onAddToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

  /**
   * Fetch recently viewed products
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/product-views/recent?limit=${limit}`)
      if (response.data && response.data.products) {
        setProducts(response.data.products)
      } else {
        setProducts([])
      }
    } catch (error) {
      // Silently fail - don't show error if no views exist
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Clear recently viewed history
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your recently viewed history?')) {
      return
    }

    try {
      setClearing(true)
      await axios.delete('/api/product-views/recent')
      setProducts([])
      toast.success('Recently viewed history cleared')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear history')
    } finally {
      setClearing(false)
    }
  }

  useEffect(() => {
    fetchRecentlyViewed()
  }, [limit])

  if (loading) {
    return (
      <div className="mb-12">
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Recently Viewed Items</h2>
          </div>
        )}
        <SkeletonLoader type="card" count={4} />
      </div>
    )
  }

  if (products.length === 0) {
    return null // Don't show anything if no products
  }

  /* Recently viewed products section */
  return (
    <div className="mb-12">
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaEye className="mr-2" />
            Your Recently Viewed Items
          </h2>
          <Button
            onClick={handleClearHistory}
            disabled={clearing}
            variant="outline"
            size="sm"
            icon="trash"
          >
            {clearing ? 'Clearing...' : 'Clear History'}
          </Button>
        </div>
      )}

      <ProductCarousel products={products} onAddToCart={onAddToCart} slidesToShow={5} />
    </div>
  )
}

export default RecentlyViewed
