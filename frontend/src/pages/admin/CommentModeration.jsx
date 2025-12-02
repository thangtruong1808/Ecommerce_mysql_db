/**
 * Comment Moderation Page Component
 * Admin page for moderating product comments
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaCheck, FaTimes, FaComments } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import Button from '../../components/Button'

/**
 * CommentModeration component
 * @returns {JSX.Element} Comment moderation page
 */
const CommentModeration = () => {
  const [pendingComments, setPendingComments] = useState([])
  const [allComments, setAllComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPending, setShowPending] = useState(true)

  /**
   * Fetch pending comments
   */
  const fetchPendingComments = async () => {
    try {
      const response = await axios.get('/api/comments/pending', {
        withCredentials: true
      })
      setPendingComments(response.data || [])
    } catch (error) {
      console.error('Error fetching pending comments:', error)
      toast.error(error.response?.data?.message || 'Failed to load pending comments')
    }
  }

  /**
   * Fetch all comments (for admin view)
   */
  const fetchAllComments = async () => {
    try {
      // This would need a new endpoint to get all comments
      // For now, we'll use the pending comments endpoint
      await fetchPendingComments()
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      if (showPending) {
        await fetchPendingComments()
      } else {
        await fetchAllComments()
      }
      setLoading(false)
    }
    fetchData()
  }, [showPending])

  /**
   * Handle approve comment
   * @param {number} commentId - Comment ID
   */
  const handleApprove = async (commentId) => {
    try {
      await axios.post(`/api/comments/${commentId}/approve`, {}, {
        withCredentials: true
      })
      toast.success('Comment approved')
      fetchPendingComments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve comment')
    }
  }

  /**
   * Handle reject comment
   * @param {number} commentId - Comment ID
   */
  const handleReject = async (commentId) => {
    try {
      await axios.post(`/api/comments/${commentId}/reject`, {}, {
        withCredentials: true
      })
      toast.success('Comment rejected')
      fetchPendingComments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject comment')
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading skeleton */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Comment Moderation</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  const comments = showPending ? pendingComments : allComments

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <FaComments className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Comment Moderation</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={showPending ? 'primary' : 'ghost'}
              onClick={() => setShowPending(true)}
            >
              Pending ({pendingComments.length})
            </Button>
            <Button
              variant={!showPending ? 'primary' : 'ghost'}
              onClick={() => setShowPending(false)}
            >
              All Comments
            </Button>
          </div>
        </div>

        {/* Comments table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {/* Table header */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Comment rows */}
              {comments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {showPending ? 'No pending comments' : 'No comments found'}
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium">{comment.user_name}</p>
                        <p className="text-sm text-gray-500">{comment.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm">{comment.product_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 line-clamp-2">{comment.comment}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          comment.is_approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comment.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {!comment.is_approved && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(comment.id)}
                            icon={<FaCheck />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(comment.id)}
                            icon={<FaTimes />}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CommentModeration

