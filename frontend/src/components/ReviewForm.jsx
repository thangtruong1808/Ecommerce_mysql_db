/**
 * Review Form Component
 * Form for submitting product reviews
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState } from 'react'
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
 */
const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  /**
   * Handle form submission
   * @param {Object} data - Form data
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

    try {
      await axios.post(`/api/products/${productId}/reviews`, {
        rating,
        comment: data.comment,
      })
      toast.success('Review submitted successfully!')
      reset()
      setRating(0)
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review'
      toast.error(message)
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
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default ReviewForm

