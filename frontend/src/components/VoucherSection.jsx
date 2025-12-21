/**
 * Voucher Section Component
 * Section component that fetches and displays active vouchers
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaTag, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import VoucherCard from './VoucherCard'
import SkeletonLoader from './SkeletonLoader'

/**
 * VoucherSection component
 * @returns {JSX.Element} Voucher section component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherSection = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch active vouchers
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/vouchers')
        setVouchers(response.data || [])
      } catch (error) {
        // Silent fail - don't show error on home page
        setVouchers([])
      } finally {
        setLoading(false)
      }
    }
    fetchVouchers()
  }, [])

  // Don't render if no vouchers
  if (!loading && vouchers.length === 0) {
    return null
  }

  /* Voucher section with attractive display */
  return (
    <section className="mb-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaTag className="text-blue-600 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-900">Special Offers & Vouchers</h2>
        </div>
        {vouchers.length > 0 && (
          <Link 
            to="/products" 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            Shop Now <FaArrowRight className="ml-2" />
          </Link>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonLoader type="card" count={3} />
        </div>
      ) : (
        /* Voucher cards grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vouchers.slice(0, 6).map((voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      )}
    </section>
  )
}

export default VoucherSection
