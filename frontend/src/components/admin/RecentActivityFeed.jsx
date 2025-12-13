/**
 * Recent Activity Feed Component
 * Timeline component showing recent activity
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import {
  FaShoppingCart,
  FaStar,
  FaComment,
  FaUserPlus,
  FaBox,
  FaCheck,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

/**
 * RecentActivityFeed component
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of recent activities
 * @param {Function} props.onApprove - Approve callback (for reviews/comments)
 * @param {Function} props.onReject - Reject callback (for reviews/comments)
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Recent activity feed component
 * @author Thang Truong
 * @date 2025-12-12
 */
const RecentActivityFeed = ({ activities = [], onApprove, onReject, onDelete }) => {
  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'order':
        return <FaShoppingCart className="text-blue-500" />
      case 'review':
        return <FaStar className="text-yellow-500" />
      case 'comment':
        return <FaComment className="text-green-500" />
      case 'registration':
        return <FaUserPlus className="text-purple-500" />
      default:
        return <FaBox className="text-gray-500" />
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Recent activity feed container */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id || index}
              className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.description || activity.message || 'Activity'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(activity.createdAt || activity.created_at || activity.date)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {activity.link && (
                    <Link
                      to={activity.link}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View details →
                    </Link>
                  )}
                  {(activity.type === 'review' || activity.type === 'comment') && (
                    <div className="flex gap-2 ml-auto">
                      {onApprove && (
                        <button
                          type="button"
                          onClick={() => onApprove(activity.id)}
                          className="text-green-600 hover:text-green-800 text-xs"
                          aria-label="Approve"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {onReject && (
                        <button
                          type="button"
                          onClick={() => onReject(activity.id)}
                          className="text-red-600 hover:text-red-800 text-xs"
                          aria-label="Reject"
                        >
                          <FaTimesCircle />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(activity, activity.type)}
                          className="text-red-600 hover:text-red-800 text-xs"
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No recent activity</p>
      )}
    </div>
  )
}

export default RecentActivityFeed
