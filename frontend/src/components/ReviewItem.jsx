/**
 * Review Item Component
 * Displays individual review with rating and comment
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import StarRating from './StarRating'

/**
 * ReviewItem component
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @returns {JSX.Element} Review item component
 */
const ReviewItem = ({ review }) => {
  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="border-b pb-4 last:border-0">
      {/* Review header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{review.user_name}</p>
          <StarRating rating={review.rating} readOnly />
        </div>
        <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
      </div>
      
      {/* Review comment */}
      <p className="text-gray-700">{review.comment}</p>
    </div>
  )
}

export default ReviewItem

