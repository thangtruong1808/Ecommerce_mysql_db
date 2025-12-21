/**
 * Star Rating Component
 * Displays or allows input of star ratings
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * StarRating component
 * @param {Object} props - Component props
 * @param {number} props.rating - Current rating (1-5)
 * @param {boolean} props.readOnly - If true, rating is display only
 * @param {Function} props.onChange - Callback when rating changes
 * @returns {JSX.Element} Star rating component
 */
const StarRating = ({ rating = 0, readOnly = false, onChange }) => {
  /**
   * Handle star click
   * @param {number} newRating - New rating value
   */
  const handleClick = (newRating) => {
    if (!readOnly && onChange) {
      onChange(newRating)
    }
  }

  return (
    <div className="flex items-center">
      {/* Star display */}
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readOnly}
          className={`text-2xl ${
            star <= rating
              ? 'text-yellow-600'
              : 'text-gray-300'
          } ${!readOnly ? 'cursor-pointer hover:text-yellow-600' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating

