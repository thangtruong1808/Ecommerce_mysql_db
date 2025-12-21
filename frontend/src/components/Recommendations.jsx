/**
 * Recommendations Component
 * Displays "You May Also Like" product recommendations
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaThumbsUp } from 'react-icons/fa'
import ProductCard from './ProductCard'
import SkeletonLoader from './SkeletonLoader'

/**
 * Recommendations component
 * @param {Object} props - Component props
 * @param {number|null} props.productId - Product ID for similar products (optional)
 * @param {number} props.limit - Maximum number of recommendations
 * @param {boolean} props.showTitle - Whether to show the title
 * @param {Function} props.onAddToCart - Add to cart handler
 * @returns {JSX.Element} Recommendations component
 * @author Thang Truong
 * @date 2025-12-12
 */
const Recommendations = ({ productId = null, limit = 15, showTitle = true, onAddToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch recommendations - maximum 5 latest products
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const endpoint = productId 
        ? `/api/product-views/recommendations/${productId}?limit=5`
        : '/api/product-views/recommendations?limit=5'
      
      const response = await axios.get(endpoint)
      if (response.data && response.data.products) {
        setProducts(response.data.products.slice(0, 5))
      } else {
        setProducts([])
      }
    } catch (error) {
      // Silently fail - don't show error if no recommendations exist
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [productId])

  if (loading) {
    return (
      <div className="mb-12">
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
        )}
        <SkeletonLoader type="card" count={4} />
      </div>
    )
  }

  if (products.length === 0) {
    return null // Don't show anything if no products
  }

  /* Recommendations products section */
  return (
    <div className="mb-12">
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaThumbsUp className="mr-2" />
          You May Also Like
        </h2>
      )}

      {/* Product grid - maximum 5 latest products, no carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  )
}

export default Recommendations
