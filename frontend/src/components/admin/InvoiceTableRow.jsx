/**
 * Invoice Table Row Component
 * Table row for invoice management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import BulkSelectCheckbox from './BulkSelectCheckbox'

/**
 * InvoiceTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.invoice - Invoice object
 * @param {boolean} props.isSelected - Whether invoice is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onResendEmail - Resend email callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Invoice table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const InvoiceTableRow = ({ invoice, isSelected, onToggle, onResendEmail, onEdit, onDelete }) => {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <Link
          to={`/invoices/${invoice.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {invoice.invoice_number}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          to={`/admin/orders`}
          className="text-blue-600 hover:text-blue-800"
        >
          {invoice.order_number || `Order #${invoice.order_id}`}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {invoice.user_name || invoice.user_email || `User #${invoice.user_id}`}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatCurrency(invoice.total_amount)}
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
        {new Date(invoice.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onResendEmail}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Resend email"
            title="Resend email"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </button>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit invoice"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete invoice"
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

export default InvoiceTableRow
