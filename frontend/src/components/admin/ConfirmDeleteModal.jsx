/**
 * Confirm Delete Modal Component
 * Reusable delete confirmation modal
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import { Button } from '../ui'

/**
 * ConfirmDeleteModal component
 * @param {Object} props - Component props
 * @param {Object|null} props.entity - Entity to delete
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-ui-lg border border-line bg-surface text-ink shadow-ui-md">
        <div className="flex items-center justify-between border-b border-line p-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-3 text-2xl text-danger" />
            <h3 className="font-ui text-lg font-semibold text-ink">Confirm Delete</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-ui text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-ink">
            Are you sure you want to delete this {entityType}?
          </p>
          {entity && (
            <div className="mb-4 rounded-ui bg-surface-muted p-4">
              <p className="font-ui font-semibold text-ink">{getEntityName()}</p>
              {entity.description && (
                <p className="mt-1 text-sm text-muted">{entity.description}</p>
              )}
            </div>
          )}
          <p className="text-sm text-danger">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-line p-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
