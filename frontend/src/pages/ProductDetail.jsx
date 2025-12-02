/**
 * Product Detail Page Component
 * Displays detailed product information with add to cart functionality
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import StarRating from '../components/StarRating'

/**
 * ProductDetail component
 * @returns {JSX.Element} Product detail page
 */
const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  /**
   * Fetch product details
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Product not found')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  /**
   * Handle add to cart
   */
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    if (quantity < 1 || quantity > product.stock) {
      toast.error('Invalid quantity')
      return
    }

    const result = await addToCart(product.id, quantity)
    if (result.success) {
      toast.success('Item added to cart!')
    } else {
      toast.error(result.error || 'Failed to add item to cart')
    }
  }

  /**
   * Handle quantity change
   * @param {number} newQuantity - New quantity value
   */
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading state */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product not found */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image section */}
        <div>
          <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          )}
        </div>

        {/* Product details section */}
        <div>
          {/* Category and subcategory breadcrumb */}
          <div className="text-sm text-gray-600 mb-2">
            {product.category_name} / {product.subcategory_name}
          </div>

          {/* Product name */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center mb-4">
              <StarRating rating={Math.round(product.rating)} readOnly />
              <span className="ml-2 text-gray-600">
                {product.rating.toFixed(1)} ({product.num_reviews} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <p className="text-3xl font-semibold text-blue-600 mb-4">${product.price}</p>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-green-600">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}
          </div>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-20 text-center border border-gray-300 rounded"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium mb-4"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        
        {/* Review form */}
        <div className="mb-8">
          <ReviewForm productId={product.id} onReviewSubmitted={() => window.location.reload()} />
        </div>

        {/* Reviews list */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ReviewList productId={product.id} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
