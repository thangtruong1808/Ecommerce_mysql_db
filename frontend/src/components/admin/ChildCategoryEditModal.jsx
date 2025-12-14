/**
 * Child Category Edit Modal Component
 * Modal for editing child category
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * ChildCategoryEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.childCategory - Child category object
 * @param {Array} props.subcategories - Subcategories array
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Child category edit modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ChildCategoryEditModal = ({ childCategory, subcategories, isOpen, onClose, onSave }) => {
  if (!isOpen || !childCategory) return null

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
      subcategory_id: formData.get('subcategory_id'),
      name: formData.get('name'),
      description: formData.get('description')
    })
  }

  /* Child category edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Child Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subcategory</label>
            <select
              name="subcategory_id"
              defaultValue={childCategory.subcategory_id}
              required
              className="w-full border rounded px-3 py-2"
            >
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.category_name} > {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={childCategory.name}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={childCategory.description || ''}
              className="w-full border rounded px-3 py-2"
              rows="3"
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

export default ChildCategoryEditModal
