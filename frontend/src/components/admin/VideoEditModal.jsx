/**
 * Video Edit Modal Component
 * Modal for editing video metadata
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * VideoEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.video - Video object
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Video edit modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const VideoEditModal = ({ video, isOpen, onClose, onSave }) => {
  if (!isOpen || !video) return null

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
      title: formData.get('title'),
      description: formData.get('description'),
      thumbnail_url: formData.get('thumbnail_url'),
      duration: formData.get('duration') ? parseInt(formData.get('duration')) : null
    })
  }

  /* Video edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={video.title || ''}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={video.description || ''}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
            <input
              type="text"
              name="thumbnail_url"
              defaultValue={video.thumbnail_url || ''}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
            <input
              type="number"
              name="duration"
              defaultValue={video.duration || ''}
              className="w-full border rounded px-3 py-2"
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

export default VideoEditModal
