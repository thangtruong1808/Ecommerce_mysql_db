/**
 * Voucher Form Component
 * Voucher code input and validation for checkout
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Button from './Button'
import { FaTag, FaTimes } from 'react-icons/fa'

/**
 * VoucherForm component
 * @param {Object} props - Component props
 * @param {number} props.orderTotal - Order total amount
 * @param {Function} props.onVoucherApplied - Callback when voucher is applied
 * @param {Function} props.onVoucherRemoved - Callback when voucher is removed
 * @returns {JSX.Element} Voucher form component
 */
const VoucherForm = ({ orderTotal, onVoucherApplied, onVoucherRemoved }) => {
  const [voucherCode, setVoucherCode] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  /**
   * Handle voucher code validation and application
   */
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Please enter a voucher code')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        '/api/vouchers/validate',
        {
          code: voucherCode.trim(),
          order_total: orderTotal,
        },
        {
          withCredentials: true
        }
      )

      if (response.data.valid) {
        setAppliedVoucher(response.data.voucher)
        setDiscountAmount(response.data.discount_amount)
        toast.success('Voucher applied successfully!')
        if (onVoucherApplied) {
          onVoucherApplied(response.data.voucher, response.data.discount_amount)
        }
      } else {
        toast.error(response.data.message || 'Invalid voucher code')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to validate voucher'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle voucher removal
   */
  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setDiscountAmount(0)
    setVoucherCode('')
    if (onVoucherRemoved) {
      onVoucherRemoved()
    }
  }

  if (appliedVoucher) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        {/* Applied voucher display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaTag className="text-green-600" />
            <div>
              <p className="font-medium text-green-900">
                Voucher: {appliedVoucher.code}
              </p>
              <p className="text-sm text-green-700">
                Discount: ${discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveVoucher}
            icon={<FaTimes />}
          >
            Remove
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
      {/* Voucher input form */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
            placeholder="Enter voucher code"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyVoucher()
              }
            }}
          />
        </div>
        <Button
          variant="primary"
          onClick={handleApplyVoucher}
          loading={loading}
          icon={<FaTag />}
        >
          Apply
        </Button>
      </div>
    </div>
  )
}

export default VoucherForm

