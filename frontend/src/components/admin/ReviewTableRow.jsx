/**
 * Review Table Row Component
 * Table row for review management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import { FaStar } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'

/**
 * ReviewTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @param {boolean} props.isSelected - Whether review is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Review table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ReviewTableRow = ({ review, isSelected, onToggle, onEdit, onDelete }) => {
  /**
   * Render star rating
   * @param {number} rating - Rating value
   * @returns {JSX.Element} Star rating display
   * @author Thang Truong
   * @date 2025-12-12
   */
  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  /* Review table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={review.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.id}</td>
      <td className="px-6 py-4 text-sm">
        <Link
          to={`/products/${review.product_id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {review.product_name || `Product #${review.product_id}`}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {review.user_name || review.user_email || `User #${review.user_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{renderStars(review.rating)}</td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={review.comment}>
        {review.comment}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(review.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit review"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete review"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ReviewTableRow
