/**
 * Comment List Component
 * Display list of approved comments for a product
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import CommentItem from './CommentItem'
import SkeletonLoader from './SkeletonLoader'
import { FaComments } from 'react-icons/fa'

/**
 * CommentList component
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID
 * @returns {JSX.Element} Comment list component
 */
const CommentList = ({ productId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch comments for the product
   */
  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/products/${productId}/comments`, {
        withCredentials: true
      })
      setComments(response.data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchComments()
    }
  }, [productId])

  /**
   * Handle comment update
   */
  const handleUpdate = () => {
    fetchComments()
  }

  /**
   * Handle comment deletion
   */
  const handleDelete = () => {
    fetchComments()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        <SkeletonLoader type="card" count={3} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Comments header */}
      <div className="flex items-center space-x-2 mb-4">
        <FaComments className="text-gray-400" />
        <h3 className="text-lg font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          {/* No comments message */}
          <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentList

