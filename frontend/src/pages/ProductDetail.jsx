/**
 * Product Detail Page Component
 * Displays detailed product information with add to cart functionality
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'
import LikeButton from '../components/LikeButton'
import StarRating from '../components/StarRating'
import ImageGallery from '../components/ImageGallery'
import VideoPlayer from '../components/VideoPlayer'
import SkeletonLoader from '../components/SkeletonLoader'
import Button from '../components/Button'
import { FaTag } from 'react-icons/fa'

/**
 * ProductDetail component
 * @returns {JSX.Element} Product detail page
 * @author Thang Truong
 * @date 2025-12-12
 */
const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/products/${id}`)
        setProduct(response.data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Product not found')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id, navigate])

  /**
   * Handle add to cart
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleAddToCart = async () => {
    if (quantity < 1 || quantity > product.stock) {
      toast.error('Invalid quantity')
      return
    }
    setAddingToCart(true)
    try {
      const result = await addToCart(product.id, quantity)
      if (result.success) {
        toast.success('Item added to cart!')
      } else {
        toast.error(result.error || 'Failed to add item to cart')
      }
    } finally {
      setAddingToCart(false)
    }
  }

  /**
   * Handle quantity change
   * @param {number} newQuantity - New quantity value
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonLoader type="card" count={1} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')} icon="search">Back to Products</Button>
        </div>
      </div>
    )
  }

  return (
    /* Product detail page layout */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image section */}
        <div>
          {/* Image gallery */}
          <ImageGallery images={product.images || []} />
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">{product.category_name} / {product.subcategory_name}</div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1">{product.name}</h1>
            <LikeButton productId={product.id} />
          </div>
          {product.rating > 0 && (
            <div className="flex items-center mb-4">
              <StarRating rating={Math.round(parseFloat(product.rating) || 0)} readOnly />
              <span className="ml-2 text-gray-600">
                {(parseFloat(product.rating) || 0).toFixed(1)} ({product.num_reviews || 0} reviews)
              </span>
            </div>
          )}
          <div className="mb-4">
            {product.has_discount && product.discounted_price ? (
                <div className="flex items-center space-x-2 mb-2">
                <span className="text-3xl font-semibold text-blue-600">${(Number(product.discounted_price) || 0).toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through">${(Number(product.price) || 0).toFixed(2)}</span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold flex items-center space-x-1">
                    <FaTag />
                  <span>{product.discount_type === 'percentage' ? `${product.discount_value}% OFF` : `$${product.discount_value} OFF`}</span>
                  </span>
              </div>
            ) : (
              <p className="text-3xl font-semibold text-blue-600">${(Number(product.price) || 0).toFixed(2)}</p>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="mb-6">
            {product.stock > 0 ? (
              <p className="text-green-600">In Stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}
          </div>

          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-2 mb-3">
                <button onClick={() => handleQuantityChange(quantity - 1)} className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100" disabled={quantity <= 1}>-</button>
                <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)} className="w-20 text-center border border-gray-300 rounded" />
                <button onClick={() => handleQuantityChange(quantity + 1)} className="w-10 h-10 rounded border border-gray-300 hover:bg-gray-100" disabled={quantity >= product.stock}>+</button>
              </div>
              <Button onClick={handleAddToCart} disabled={product.stock === 0} loading={addingToCart} icon="cart" className="w-full py-3">Add to Cart</Button>
              </div>
          )}
          {product.stock === 0 && (
            <div className="mb-6">
              <Button disabled={true} className="w-full py-3">Out of Stock</Button>
            </div>
          )}
        </div>
      </div>

      {product.videos && product.videos.length > 0 && (
        <div className="mt-8">
          <VideoPlayer videos={product.videos} />
        </div>
      )}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
        <div className="mb-8">
          <ReviewForm productId={product.id} onReviewSubmitted={() => window.location.reload()} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ReviewList productId={product.id} />
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
        <div className="mb-8">
          <CommentForm productId={product.id} onCommentSubmitted={() => window.location.reload()} />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <CommentList productId={product.id} />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
