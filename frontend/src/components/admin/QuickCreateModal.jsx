/**
 * Quick Create Modal Component
 * Modal for quick creation from dashboard
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import Button from '../Button'

/**
 * QuickCreateModal component
 * @param {Object} props - Component props
 * @param {string} props.type - Entity type (product, user, voucher)
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSuccess - Success callback
 * @returns {JSX.Element} Quick create modal component
 */
const QuickCreateModal = ({ type, isOpen = false, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  /**
   * Reset form when modal opens/closes
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (!isOpen) {
      setFormData({})
      setErrors({})
    }
  }, [isOpen])

  /**
   * Get form fields based on type
   * @returns {Array} Form fields configuration
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getFormFields = () => {
    const fields = {
      product: [
        { name: 'name', label: 'Product Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'stock', label: 'Stock', type: 'number', required: true },
        { name: 'child_category_id', label: 'Category', type: 'number', required: true }
      ],
      user: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['user', 'admin'], required: true }
      ],
      voucher: [
        { name: 'code', label: 'Code', type: 'text', required: true },
        { name: 'discount_type', label: 'Discount Type', type: 'select', options: ['percentage', 'fixed'], required: true },
        { name: 'discount_value', label: 'Discount Value', type: 'number', required: true },
        { name: 'start_date', label: 'Start Date', type: 'datetime-local', required: true },
        { name: 'end_date', label: 'End Date', type: 'datetime-local', required: true }
      ]
    }
    return fields[type] || []
  }

  /**
   * Handle input change
   * @param {Object} e - Event object
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  /**
   * Handle submit
   * @param {Object} e - Event object
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (onSuccess) {
        await onSuccess(formData)
      }
      onClose()
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create' })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const fields = getFormFields()

  /* Quick create modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
          )}

          {/* Modal footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2"
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuickCreateModal
