/**
 * Category Edit Modal Component
 * Modal for editing category with photo upload support
 * 
 * @author Thang Truong
 * @date 2025-01-28
 */

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaTimes } from 'react-icons/fa'

/**
 * CategoryEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.category - Category object
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Category edit modal component
 * @author Thang Truong
 * @date 2025-01-28
 */
const CategoryEditModal = ({ category, isOpen, onClose, onSave }) => {
  const [photoPreview, setPhotoPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [deletingPhoto, setDeletingPhoto] = useState(false)
  const fileInputRef = useRef(null)

  // Set photo preview when category changes
  useEffect(() => {
    if (isOpen && category?.photo_url) {
      const photoUrl = category.photo_url.startsWith('http') 
        ? category.photo_url 
        : `${window.location.origin}${category.photo_url}`
      setPhotoPreview(photoUrl)
    } else if (isOpen && category) {
      setPhotoPreview(null)
    }
    if (isOpen && category) {
      setSelectedFile(null)
    }
  }, [category, isOpen])

  if (!isOpen || !category) return null

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
   * Handle delete photo
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleDeletePhoto = async () => {
    if (!category.photo_url) return
    
    try {
      setDeletingPhoto(true)
      await axios.delete(`/api/admin/categories/${category.id}/photo`)
      toast.success('Photo deleted successfully')
      setPhotoPreview(null)
      setSelectedFile(null)
      onSave({ name: category.name, description: category.description })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete photo')
    } finally {
      setDeletingPhoto(false)
    }
  }

  /**
   * Handle form submit
   * @param {Event} e - Form event
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      // First update category data (name, description)
      const updateData = {
        name: formData.get('name'),
        description: formData.get('description')
      }
      
      // If photo is selected, upload it separately
      if (selectedFile) {
        const photoFormData = new FormData()
        photoFormData.append('photo', selectedFile)
        await axios.post(`/api/admin/categories/${category.id}/photo`, photoFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Photo uploaded successfully')
      }
      
      onSave(updateData)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category')
    }
  }

  /* Category edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Category</h2>
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
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={category.name}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={category.description || ''}
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>
          
          {/* Photo upload section */}
          <div>
            <label className="block text-sm font-medium mb-1">Photo</label>
            {photoPreview && (
              <div className="mb-2 relative inline-block">
                <img
                  src={photoPreview}
                  alt="Category preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                {category.photo_url && !selectedFile && (
                  <button
                    type="button"
                    onClick={handleDeletePhoto}
                    disabled={deletingPhoto}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    aria-label="Delete photo"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">Upload a new photo to replace the current one</p>
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

export default CategoryEditModal
