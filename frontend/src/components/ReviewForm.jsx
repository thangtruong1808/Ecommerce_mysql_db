/**
 * Review Form Component
 * Form for submitting product reviews
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import StarRating from './StarRating'

/**
 * ReviewForm component
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID
 * @param {Function} props.onReviewSubmitted - Callback after review submission
 * @returns {JSX.Element} Review form component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { isAuthenticated, user } = useAuth()
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isEligible, setIsEligible] = useState(false)
  const [checkingEligibility, setCheckingEligibility] = useState(true)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  /**
   * Check if user is eligible to review (has purchased) and if already reviewed
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!isAuthenticated || !user || !productId) {
        setCheckingEligibility(false)
        return
      }
      try {
        const [reviewResponse, eligibilityResponse] = await Promise.all([
          axios.get(`/api/products/${productId}/reviews/my`, {
            withCredentials: true
          }).catch(() => ({ data: null })),
          axios.get(`/api/products/${productId}/reviews/eligibility`, {
            withCredentials: true
          }).catch(() => ({ data: { eligible: false } }))
        ])
        if (reviewResponse.data) {
          setHasReviewed(true)
        }
        setIsEligible(eligibilityResponse.data?.eligible || false)
      } catch (error) {
        setIsEligible(false)
      } finally {
        setCheckingEligibility(false)
      }
    }
    checkReviewStatus()
  }, [isAuthenticated, user, productId])

  /**
   * Handle form submission
   * @param {Object} data - Form data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a review')
      return
    }

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)
    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment: data.comment,
      }, {
        withCredentials: true
      })
      toast.success('Review submitted successfully!')
      setHasReviewed(true)
      reset()
      setRating(0)
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      // Handle 401 errors
      if (error.response?.status === 401) {
        toast.error('Your session expired. Please try again.')
      } else {
        const message = error.response?.data?.message || 'Failed to submit review'
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        {/* Not authenticated message */}
        <p className="text-gray-600">Please login to write a review</p>
      </div>
    )
  }

  if (checkingEligibility) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        {/* Checking eligibility message */}
        <p className="text-gray-600">Checking review eligibility...</p>
      </div>
    )
  }

  if (!isEligible) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-md text-center">
        {/* Not eligible message */}
        <p className="text-gray-700 mb-2">
          <strong>Review this product</strong>
        </p>
        <p className="text-sm text-gray-600">
          To write a review, you must have purchased this product. Once you've made a purchase, you'll be able to share your experience and help other customers make informed decisions.
        </p>
      </div>
    )
  }

  if (hasReviewed) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        {/* Already reviewed message */}
        <p className="text-gray-600">You have already submitted a review for this product.</p>
      </div>
    )
  }

  /* Review form layout */
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Review form */}
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Rating selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating rating={rating} onChange={setRating} />
          {rating === 0 && (
            <p className="mt-1 text-sm text-red-600">Please select a rating</p>
          )}
        </div>

        {/* Comment input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            {...register('comment', { required: 'Review comment is required' })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your review here..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default ReviewForm

