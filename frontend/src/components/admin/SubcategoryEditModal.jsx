/**
 * Subcategory Edit Modal Component
 * Modal for editing subcategory
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * SubcategoryEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.subcategory - Subcategory object
 * @param {Array} props.categories - Categories array
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Subcategory edit modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const SubcategoryEditModal = ({ subcategory, categories, isOpen, onClose, onSave }) => {
  if (!isOpen || !subcategory) return null

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
      category_id: formData.get('category_id'),
      name: formData.get('name'),
      description: formData.get('description')
    })
  }

  /* Subcategory edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Subcategory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category_id"
              defaultValue={subcategory.category_id}
              required
              className="w-full border rounded px-3 py-2"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={subcategory.name}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={subcategory.description || ''}
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

export default SubcategoryEditModal
