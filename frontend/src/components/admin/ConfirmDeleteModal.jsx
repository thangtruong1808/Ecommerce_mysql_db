/**
 * Confirm Delete Modal Component
 * Reusable delete confirmation modal
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'

/**
 * ConfirmDeleteModal component
 * @param {Object} props - Component props
 * @param {Object} props.entity - Entity to delete
 * @param {string} props.entityType - Entity type (order, product, user, etc.)
 * @param {Function} props.onConfirm - Confirm callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {boolean} props.isOpen - Modal open state
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element} Confirm delete modal component
 */
const ConfirmDeleteModal = ({ 
  entity, 
  entityType = 'item', 
  onConfirm, 
  onCancel, 
  isOpen = false,
  loading = false 
}) => {
  if (!isOpen) return null

  /**
   * Get entity display name
   * @returns {string} Display name
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getEntityName = () => {
    if (!entity) return ''
    return entity.name || entity.order_number || entity.email || entity.code || `#${entity.id}`
  }

  /* Confirm delete modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-600 text-2xl mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this {entityType}?
          </p>
          {entity && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="font-semibold text-gray-900">{getEntityName()}</p>
              {entity.description && (
                <p className="text-sm text-gray-600 mt-1">{entity.description}</p>
              )}
            </div>
          )}
          <p className="text-sm text-red-600">
            This action cannot be undone.
          </p>
        </div>

        {/* Modal footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
