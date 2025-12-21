/**
 * Voucher Code Item Component
 * Displays individual voucher code with copy functionality and expiry info
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaCopy, FaCheck, FaTag } from 'react-icons/fa'
import { formatDate, formatDateTime } from '../utils/dateUtils'

/**
 * VoucherCodeItem component
 * @param {Object} props - Component props
 * @param {Object} props.voucher - Voucher object
 * @param {boolean} props.isCopied - Whether code is copied
 * @param {Function} props.onCopy - Copy callback
 * @param {boolean} props.showHeader - Whether to show header text
 * @returns {JSX.Element} Voucher code item component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherCodeItem = ({ voucher, isCopied, onCopy, showHeader = false }) => {
  /**
   * Get discount display text
   * @returns {string} Discount text
   * @author Thang Truong
   * @date 2025-12-17
   */
  const getDiscountText = () => {
    if (voucher.discount_type === 'percentage') {
      return `${Math.round(parseFloat(voucher.discount_value))}%`
    }
    return `$${parseFloat(voucher.discount_value).toFixed(2)}`
  }

  /* Voucher code item with copy button and expiry info - inline layout */
  return (
    <div className="w-full rounded-lg p-2 border border-white/20 ">
      {/* Header text - centered */}
      {showHeader && (
        <div className="text-center mb-2">          
          <span className="text-md text-yellow-600 font-medium">Available Voucher Codes: {getDiscountText()} OFF</span>
        </div>
      )}
      {/* Main content - inline layout */}
      <div className="flex items-center justify-center gap-2 mb-1">
        {/* Discount and voucher code */}
        <div className="flex items-center justify-center gap-2 flex-1">          
          <span className="font-mono text-4xl font-semibold text-yellow-600 mr-4">
            {voucher.code}
          </span>
          <button
          onClick={() => onCopy(voucher.code)}
          className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors flex-shrink-0"
          aria-label={`Copy voucher code ${voucher.code}`}
        >
          {isCopied ? (
            <FaCheck className="text-xs text-white" />
          ) : (
            <FaCopy className="text-xs text-white" />
          )}
        </button>
        
        </div>
        {/* Copy button */}
        
      </div>
      {/* Expiry information - inline */}
      <div className="text-xs text-yellow-600 flex flex-wrap items-center justify-center gap-2">
        <span>Valid: {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}</span>
        <span>•</span>
        <span>Expires: {formatDateTime(voucher.end_date)}</span>
        {voucher.usage_limit_per_user && (
          <>
            <span>•</span>
            <span>Limit: {voucher.usage_limit_per_user} use{voucher.usage_limit_per_user !== 1 ? 's' : ''} per user</span>
          </>
        )}
      </div>
    </div>
  )
}

export default VoucherCodeItem
