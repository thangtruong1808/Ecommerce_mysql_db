/**
 * Review Item Component
 * Displays individual review with rating and comment
 * @author Thang Truong
 * @date 2025-12-12
 */

import StarRating from './StarRating'

/**
 * Format date to dd-MMM-yyyy, hh:mm AM/PM format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 * @author Thang Truong
 * @date 2025-12-12
 */
const formatDate = (date) => {
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()
  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  const hoursStr = String(hours).padStart(2, '0')
  return `${day}-${month}-${year}, ${hoursStr}:${minutes} ${ampm}`
}

/**
 * ReviewItem component
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @returns {JSX.Element} Review item component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ReviewItem = ({ review }) => {

  /* Review item layout */
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

