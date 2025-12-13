/**
 * Bulk Action Bar Component
 * Appears when items are selected, shows action buttons
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaTimes, FaTrash, FaCheck, FaTimesCircle, FaToggleOn, FaToggleOff } from 'react-icons/fa'

/**
 * BulkActionBar component
 * @param {Object} props - Component props
 * @param {number} props.selectedCount - Number of selected items
 * @param {Array<Object>} props.actions - Available actions
 * @param {Function} props.onAction - Action callback
 * @param {Function} props.onCancel - Cancel selection callback
 * @returns {JSX.Element} Bulk action bar component
 * @author Thang Truong
 * @date 2025-12-12
 */
const BulkActionBar = ({ selectedCount, actions = [], onAction, onCancel }) => {
  /**
   * Get action icon
   * @param {string} actionType - Action type
   * @returns {JSX.Element} Icon component
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getActionIcon = (actionType) => {
    const iconMap = {
      delete: FaTrash,
      approve: FaCheck,
      reject: FaTimesCircle,
      activate: FaToggleOn,
      deactivate: FaToggleOff
    }
    const Icon = iconMap[actionType] || FaCheck
    return <Icon className="mr-2" />
  }

  /**
   * Get action color
   * @param {string} actionType - Action type
   * @returns {string} Tailwind color classes
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getActionColor = (actionType) => {
    const colorMap = {
      delete: 'bg-red-600 hover:bg-red-700',
      approve: 'bg-green-600 hover:bg-green-700',
      reject: 'bg-red-600 hover:bg-red-700',
      activate: 'bg-green-600 hover:bg-green-700',
      deactivate: 'bg-gray-600 hover:bg-gray-700'
    }
    return colorMap[actionType] || 'bg-blue-600 hover:bg-blue-700'
  }

  if (selectedCount === 0) return null

  /* Bulk action bar */
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg px-6 py-4 flex items-center gap-4 z-50">
      <span className="text-sm font-semibold text-gray-700">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action.type}
            type="button"
            onClick={() => onAction && onAction(action.type, action.data)}
            className={`${getActionColor(action.type)} text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors`}
          >
            {getActionIcon(action.type)}
            {action.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="text-gray-600 hover:text-gray-800 p-2"
        aria-label="Cancel selection"
      >
        <FaTimes />
      </button>
    </div>
  )
}

export default BulkActionBar
