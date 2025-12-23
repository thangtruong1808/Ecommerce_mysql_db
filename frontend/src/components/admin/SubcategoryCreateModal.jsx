/**
 * Subcategory Create Modal Component
 * Modal for creating subcategory with photo upload support
 * 
 * @author Thang Truong
 * @date 2025-01-28
 */

import { useState, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'

/**
 * SubcategoryCreateModal component
 * @param {Object} props - Component props
 * @param {Array} props.categories - Categories array
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Subcategory create modal component
 * @author Thang Truong
 * @date 2025-01-28
 */
const SubcategoryCreateModal = ({ categories, isOpen, onClose, onSave }) => {
  const [photoPreview, setPhotoPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  /**
   * Handle file selection
   * @param {Event} e - File input event
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Handle form submit
   * @param {Event} e - Form event
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    onSave({
      category_id: formData.get('category_id'),
      name: formData.get('name'),
      description: formData.get('description'),
      photo: selectedFile
    })
  }

  /* Subcategory create modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Subcategory</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category_id"
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Category</option>
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
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>
          
          {/* Photo upload section */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            {photoPreview && (
              <div className="mb-2">
                <img
                  src={photoPreview}
                  alt="Subcategory preview"
                  className="w-24 h-24 object-cover rounded border"
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Upload a photo for this subcategory</p>
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubcategoryCreateModal
