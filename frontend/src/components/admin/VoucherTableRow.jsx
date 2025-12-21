/**
 * Voucher Table Row Component
 * Table row for voucher management
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaEdit, FaTrash } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'
import { formatDate } from '../../utils/dateUtils'

/**
 * VoucherTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.voucher - Voucher object
 * @param {number} props.index - Sequential index number
 * @param {boolean} props.isSelected - Whether voucher is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Voucher table row component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherTableRow = ({ voucher, index, isSelected, onToggle, onEdit, onDelete }) => {
  /**
   * Check if voucher is active
   * @param {Object} v - Voucher object
   * @returns {string} Status string
   * @author Thang Truong
   * @date 2025-12-17
   */
  const getVoucherStatus = (v) => {
    if (!v.is_active) return { text: 'Inactive', class: 'bg-gray-100 text-gray-800' }
    const now = new Date()
    const start = new Date(v.start_date)
    const end = new Date(v.end_date)
    if (now < start) return { text: 'Not Started', class: 'bg-yellow-100 text-yellow-800' }
    if (now > end) return { text: 'Expired', class: 'bg-red-100 text-red-800' }
    return { text: 'Active', class: 'bg-green-100 text-green-800' }
  }

  const status = getVoucherStatus(voucher)

  /* Voucher table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={voucher.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-sm text-gray-900">
        {voucher.code}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {voucher.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {voucher.discount_type === 'percentage'
          ? `${Math.round(parseFloat(voucher.discount_value))}%`
          : `$${parseFloat(voucher.discount_value).toFixed(2)}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {voucher.current_usage_count}
        {voucher.total_usage_limit ? ` / ${voucher.total_usage_limit}` : ' / ∞'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${status.class}`}>
          {status.text}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="Edit voucher"
          >
            <FaEdit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete voucher"
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default VoucherTableRow
