/**
 * Review Table Row Component
 * Table row for review management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'
import { formatDate } from '../../utils/dateUtils'

/**
 * ReviewTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @param {number} props.index - Sequential index number
 * @param {boolean} props.isSelected - Whether review is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Review table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ReviewTableRow = ({ review, index, isSelected, onToggle, onEdit, onDelete }) => {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{review.id}</td>
      <td className="px-6 py-4 text-sm">
        <Link
          to={`/products/${review.product_id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {review.product_name || `Product #${review.product_id}`}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.product_id}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {review.user_name || review.user_email || `User #${review.user_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.user_id}</td>
      <td className="px-6 py-4 whitespace-nowrap">{renderStars(review.rating)}</td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={review.comment}>
        {review.comment}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(review.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(review.updated_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="Edit review"
          >
            <FaEdit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete review"
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ReviewTableRow
