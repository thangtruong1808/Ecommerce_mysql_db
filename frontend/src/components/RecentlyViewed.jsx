/**
 * Recently Viewed Component
 * Displays recently viewed products for both authenticated and guest users
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEye, FaTimes, FaExclamationTriangle } from 'react-icons/fa'
import ProductCard from './ProductCard'
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
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  /**
   * Fetch recently viewed products - maximum 5 latest products
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchRecentlyViewed = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/product-views/recent?limit=5')
      if (response.data && response.data.products) {
        setProducts(response.data.products.slice(0, 5))
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
   * Open confirmation modal
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleOpenConfirm = () => {
    setShowConfirmModal(true)
  }

  /**
   * Close confirmation modal
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleCloseConfirm = () => {
    setShowConfirmModal(false)
  }

  /**
   * Clear recently viewed history
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleClearHistory = async () => {
    setShowConfirmModal(false)
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
  }, [])

  if (loading) {
    return (
      <div className="mb-12">
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Recently Viewed Items</h2>
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
            onClick={handleOpenConfirm}
            disabled={clearing}
            variant="outline"
            size="sm"
            icon="trash"
          >
            {clearing ? 'Clearing...' : 'Clear History'}
          </Button>
        </div>
      )}

      {/* Product grid - maximum 5 latest products, no carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      {/* Confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleCloseConfirm}>
          {/* Modal container */}
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-blue-600 text-2xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Clear History</h3>
              </div>
              <button
                onClick={handleCloseConfirm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            {/* Modal body */}
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to clear your recently viewed history? This action cannot be undone.
              </p>
            </div>
            {/* Modal footer */}
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={handleCloseConfirm}
                disabled={clearing}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {clearing ? 'Clearing...' : 'Clear History'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentlyViewed
