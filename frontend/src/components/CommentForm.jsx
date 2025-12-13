/**
 * Comment Form Component
 * Form for submitting product comments
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import Button from './Button'
import { FaComment, FaSmile } from 'react-icons/fa'

/**
 * CommentForm component
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID
 * @param {Function} props.onCommentSubmitted - Callback after comment submission
 * @returns {JSX.Element} Comment form component
 * @author Thang Truong
 * @date 2025-12-12
 */
const CommentForm = ({ productId, onCommentSubmitted }) => {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm()
  const watchedComment = watch('comment', '')

  /**
   * Insert emoji into comment text
   * @param {string} emoji - Emoji to insert
   * @author Thang Truong
   * @date 2025-12-12
   */
  const insertEmoji = (emoji) => {
    const currentText = watchedComment || ''
    const newText = currentText + emoji
    setValue('comment', newText, { shouldValidate: true })
  }

  /**
   * Handle form submission
   * @param {Object} data - Form data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to submit a comment')
      return
    }

    setLoading(true)
    try {
      await axios.post(`/api/products/${productId}/comments`, {
        comment: data.comment,
      }, {
        withCredentials: true
      })
      toast.success('Comment submitted successfully!')
      reset()
      if (onCommentSubmitted) {
        onCommentSubmitted()
      }
    } catch (error) {
      // Handle 401 errors
      if (error.response?.status === 401) {
        toast.error('Your session expired. Please try again.')
      } else {
        const message = error.response?.data?.message || 'Failed to submit comment'
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const emojis = ['😀', '😃', '😄', '😁', '😊', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯']

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        {/* Not authenticated message */}
        <p className="text-gray-600">Please login to write a comment</p>
      </div>
    )
  }

  /* Comment form layout */
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Comment form */}
      <h3 className="text-lg font-semibold mb-4">Write a Comment</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Comment input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Comment
          </label>
          <textarea
            {...register('comment', { required: 'Comment is required' })}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your comment here..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
          )}
          {/* Emoji picker */}
          <div className="mt-2 flex items-center space-x-2">
            <FaSmile className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="text-xl hover:scale-125 transition-transform cursor-pointer"
                  title={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={<FaComment />}
        >
          Submit Comment
        </Button>
      </form>
    </div>
  )
}

export default CommentForm

