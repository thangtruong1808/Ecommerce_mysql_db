/**
 * Voucher CTA Component
 * Displays active voucher information in megamenu CTA section
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaTag, FaArrowRight } from 'react-icons/fa'

/**
 * VoucherCTA component
 * @returns {JSX.Element} Voucher CTA component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherCTA = () => {
  const [voucher, setVoucher] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch first active voucher
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/vouchers')
        const vouchers = response.data || []
        // Get first active voucher
        if (vouchers.length > 0) {
          setVoucher(vouchers[0])
        }
      } catch (error) {
        // Silent fail
        setVoucher(null)
      } finally {
        setLoading(false)
      }
    }
    fetchVoucher()
  }, [])

  // Show default CTA if no voucher or loading
  if (loading || !voucher) {
    return (
      <Link 
        to="/products" 
        className="block relative h-full min-h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 hover:opacity-90 transition-opacity group"
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
        <div className="relative h-full p-6 flex flex-col justify-between text-white">
          <div>
            <FaTag className="text-3xl mb-2" />
            <h4 className="text-2xl font-bold mb-2">Special Offers</h4>
            <p className="text-sm opacity-90">Check out our latest deals and discounts</p>
          </div>
          <span className="text-sm font-semibold underline">Shop Now →</span>
        </div>
      </Link>
    )
  }

  /**
   * Format discount display with rounded percentage
   * @returns {string} Discount text
   * @author Thang Truong
   * @date 2025-12-17
   */
  const getDiscountText = () => {
    if (voucher.discount_type === 'percentage') {
      return `${Math.round(parseFloat(voucher.discount_value))}% OFF`
    }
    return `$${parseFloat(voucher.discount_value).toFixed(2)} OFF`
  }

  /* Voucher CTA with active voucher information */
  return (
    <Link 
      to="/products" 
      className="block relative h-full min-h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 hover:opacity-90 transition-opacity group"
    >
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
      <div className="relative h-full p-6 flex flex-col justify-between text-white">
        <div>
          <FaTag className="text-3xl mb-2" />
          <h4 className="text-2xl font-bold mb-2">Use Code: {voucher.code}</h4>
          <p className="text-lg font-semibold mb-1">{getDiscountText()}</p>
          {voucher.description && (
            <p className="text-sm opacity-90 line-clamp-2">{voucher.description}</p>
          )}
        </div>
        <span className="text-sm font-semibold underline flex items-center">
          Shop Now <FaArrowRight className="ml-1" />
        </span>
      </div>
    </Link>
  )
}

export default VoucherCTA
