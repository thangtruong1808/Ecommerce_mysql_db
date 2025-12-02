/**
 * Review List Component
 * Displays list of product reviews
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import ReviewItem from './ReviewItem'

/**
 * ReviewList component
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID
 * @returns {JSX.Element} Review list component
 */
const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch reviews for product
   */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/products/${productId}/reviews`)
        setReviews(response.data.reviews || [])
      } catch (error) {
        console.error('Error fetching reviews:', error)
        toast.error(error.response?.data?.message || 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchReviews()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="text-center py-4">
        {/* Loading state */}
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        {/* No reviews message */}
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Reviews list */}
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  )
}

export default ReviewList

