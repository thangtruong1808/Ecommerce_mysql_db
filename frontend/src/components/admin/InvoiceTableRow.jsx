/**
 * Invoice Table Row Component
 * Table row for invoice management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import { FaEnvelope, FaEdit, FaTrash } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'
import { formatDate } from '../../utils/dateUtils'

/**
 * InvoiceTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.invoice - Invoice object
 * @param {number} props.index - Sequential index number
 * @param {boolean} props.isSelected - Whether invoice is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onResendEmail - Resend email callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Invoice table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const InvoiceTableRow = ({ invoice, index, isSelected, onToggle, onResendEmail, onEdit, onDelete }) => {
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

  /* Invoice table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={invoice.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link
          to={`/invoices/${invoice.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {invoice.invoice_number}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.order_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          to={`/admin/orders`}
          className="text-blue-600 hover:text-blue-800"
        >
          {invoice.order_number || `Order #${invoice.order_id}`}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.user_id}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {invoice.user_name || invoice.user_email || `User #${invoice.user_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(invoice.subtotal)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(invoice.tax_amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(invoice.shipping_amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatCurrency(invoice.total_amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {invoice.payment_method || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-1 rounded text-xs ${
          invoice.payment_status === 'paid' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {invoice.payment_status || 'pending'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {invoice.email_sent ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-gray-400">No</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {invoice.email_sent_at ? formatDate(invoice.email_sent_at) : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(invoice.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onResendEmail}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            aria-label="Resend email"
            title="Resend email"
          >
            <FaEnvelope className="w-3 h-3" />
            Email
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="Edit invoice"
          >
            <FaEdit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete invoice"
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default InvoiceTableRow
