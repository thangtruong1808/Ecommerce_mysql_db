/**
 * Quick Action Button Component
 * Floating action button for quick creates
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaPlus } from 'react-icons/fa'

/**
 * QuickActionButton component
 * @param {Object} props - Component props
 * @param {string} props.type - Action type (product, user, voucher)
 * @param {Function} props.onCreate - Create callback
 * @param {string} props.label - Button label
 * @returns {JSX.Element} Quick action button component
 * @author Thang Truong
 * @date 2025-12-12
 */
const QuickActionButton = ({ type, onCreate, label }) => {
  /**
   * Get button label
   * @returns {string} Button label
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getLabel = () => {
    if (label) return label
    const labels = {
      product: 'Add Product',
      user: 'Add User',
      voucher: 'Add Voucher'
    }
    return labels[type] || 'Add New'
  }

  /**
   * Handle click
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleClick = () => {
    if (onCreate) {
      onCreate(type)
    }
  }

  /* Quick action button */
  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
      aria-label={getLabel()}
    >
      <FaPlus className="mr-2" />
      {getLabel()}
    </button>
  )
}

export default QuickActionButton
