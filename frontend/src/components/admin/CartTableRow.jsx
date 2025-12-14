/**
 * Cart Table Row Component
 * Table row for cart management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import { FaEye, FaTrash } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'
import { formatDate } from '../../utils/dateUtils'

/**
 * CartTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.cart - Cart object
 * @param {number} props.index - Sequential index number
 * @param {boolean} props.isSelected - Whether cart is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onView - View callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Cart table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const CartTableRow = ({ cart, index, isSelected, onToggle, onView, onDelete }) => {
  /**
   * Format currency
   * @param {number} amount - Amount
   * @returns {string} Formatted currency
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  /* Cart table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={cart.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cart.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {cart.user_id || <span className="text-gray-400">Guest</span>}
      </td>
      <td className="px-6 py-4 text-sm">
        {cart.user_id ? (
          <Link
            to={`/admin/users`}
            className="text-blue-600 hover:text-blue-800"
          >
            {cart.user_name || cart.user_email || `User #${cart.user_id}`}
          </Link>
        ) : (
          <span className="text-gray-500">Guest</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cart.item_count || 0}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(cart.total_value)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(cart.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(cart.updated_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="View cart"
          >
            <FaEye className="w-3 h-3" />
            View
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete cart"
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CartTableRow
