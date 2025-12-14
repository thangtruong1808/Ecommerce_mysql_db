/**
 * Cart Table Row Component
 * Table row for cart management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import BulkSelectCheckbox from './BulkSelectCheckbox'

/**
 * CartTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.cart - Cart object
 * @param {boolean} props.isSelected - Whether cart is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onView - View callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Cart table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const CartTableRow = ({ cart, isSelected, onToggle, onView, onDelete }) => {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cart.id}</td>
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
        {new Date(cart.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800"
            aria-label="View cart"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete cart"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CartTableRow
