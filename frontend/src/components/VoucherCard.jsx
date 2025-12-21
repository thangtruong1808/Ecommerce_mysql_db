/**
 * Voucher Card Component
 * Attractive card component to display voucher information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaTag, FaCopy, FaCheck } from 'react-icons/fa'
import { formatDate } from '../utils/dateUtils'

/**
 * VoucherCard component
 * @param {Object} props - Component props
 * @param {Object} props.voucher - Voucher object
 * @returns {JSX.Element} Voucher card component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherCard = ({ voucher }) => {
  const [copied, setCopied] = useState(false)

  /**
   * Handle copy voucher code to clipboard
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code)
      setCopied(true)
      toast.success('Voucher code copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  /**
   * Calculate days until expiry
   * @returns {number} Days until expiry
   * @author Thang Truong
   * @date 2025-12-17
   */
  const getDaysUntilExpiry = () => {
    const now = new Date()
    const end = new Date(voucher.end_date)
    const diff = end - now
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const daysLeft = getDaysUntilExpiry()
  const isPercentage = voucher.discount_type === 'percentage'
  const gradientClass = isPercentage 
    ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
    : 'bg-gradient-to-br from-green-500 to-emerald-600'

  /* Voucher card with attractive design */
  return (
    <div className={`${gradientClass} rounded-lg shadow-lg p-6 text-white transform transition-transform hover:scale-105 relative overflow-hidden`}>
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
      
      {/* Card content */}
      <div className="relative z-10">
        {/* Header with icon and copy button */}
        <div className="flex items-center justify-between mb-4">
          <FaTag className="text-2xl" />
          <button
            onClick={handleCopyCode}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
            aria-label="Copy voucher code"
          >
            {copied ? (
              <FaCheck className="text-sm" />
            ) : (
              <FaCopy className="text-sm" />
            )}
          </button>
        </div>

        {/* Discount value - large and prominent */}
        <div className="mb-3">
          <div className="text-4xl font-bold">
            {isPercentage 
              ? `${Math.round(parseFloat(voucher.discount_value))}%` 
              : `$${parseFloat(voucher.discount_value).toFixed(2)}`}
          </div>
          <div className="text-sm opacity-90 mt-1">OFF</div>
        </div>

        {/* Voucher code - prominent */}
        <div className="mb-4">
          <div className="text-xs opacity-80 mb-1">Voucher Code</div>
          <div className="font-mono text-xl font-bold bg-white bg-opacity-20 px-3 py-2 rounded inline-block">
            {voucher.code}
          </div>
        </div>

        {/* Description */}
        {voucher.description && (
          <div className="mb-4 text-sm opacity-90 line-clamp-2">
            {voucher.description}
          </div>
        )}

        {/* Details */}
        <div className="space-y-2 text-xs opacity-80">
          {voucher.min_purchase_amount > 0 && (
            <div>Min purchase: ${voucher.min_purchase_amount}</div>
          )}
          <div>Valid until: {formatDate(voucher.end_date)}</div>
          {daysLeft > 0 && daysLeft <= 7 && (
            <div className="font-semibold text-yellow-200">
              Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoucherCard
