/**
 * Bulk Select Checkbox Component
 * Checkbox for selecting items in tables with select all functionality
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaCheck } from 'react-icons/fa'

/**
 * BulkSelectCheckbox component
 * @param {Object} props - Component props
 * @param {string|number} props.itemId - Item ID
 * @param {boolean} props.isSelected - Whether item is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {boolean} props.isSelectAll - Whether this is the select all checkbox
 * @param {Function} props.onSelectAll - Select all callback
 * @param {number} props.totalItems - Total items count
 * @param {number} props.selectedCount - Currently selected count
 * @returns {JSX.Element} Bulk select checkbox component
 */
const BulkSelectCheckbox = ({ 
  itemId, 
  isSelected, 
  onToggle, 
  isSelectAll = false,
  onSelectAll,
  totalItems = 0,
  selectedCount = 0
}) => {
  /**
   * Handle checkbox change
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleChange = () => {
    if (isSelectAll) {
      onSelectAll(selectedCount < totalItems)
    } else {
      onToggle(itemId)
    }
  }

  const isIndeterminate = !isSelectAll && selectedCount > 0 && selectedCount < totalItems
  const isAllSelected = isSelectAll && selectedCount === totalItems && totalItems > 0

  /* Bulk select checkbox */
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleChange}
        className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
          isSelected || isAllSelected
            ? 'bg-blue-600 border-blue-600 text-white'
            : isIndeterminate
            ? 'bg-blue-300 border-blue-600'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        aria-label={isSelectAll ? 'Select all items' : `Select item ${itemId}`}
      >
        {(isSelected || isAllSelected) && <FaCheck className="text-xs" />}
        {isIndeterminate && isSelectAll && <div className="w-3 h-0.5 bg-blue-600" />}
      </button>
    </div>
  )
}

export default BulkSelectCheckbox
