/**
 * Review Edit Modal Component
 * Modal for editing review
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * ReviewEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Review edit modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ReviewEditModal = ({ review, isOpen, onClose, onSave }) => {
  if (!isOpen || !review) return null

  /**
   * Handle form submit
   * @param {Event} e - Form event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    onSave({
      rating: formData.get('rating') ? parseInt(formData.get('rating')) : undefined,
      comment: formData.get('comment')
    })
  }

  /* Review edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              name="rating"
              defaultValue={review.rating}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              name="comment"
              defaultValue={review.comment}
              required
              className="w-full border rounded px-3 py-2"
              rows="4"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewEditModal
