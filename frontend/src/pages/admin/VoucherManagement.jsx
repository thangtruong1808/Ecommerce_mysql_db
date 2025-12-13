/**
 * Voucher Management Page Component
 * Admin page for managing vouchers
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaTag } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import Button from '../../components/Button'

/**
 * VoucherManagement component
 * @returns {JSX.Element} Voucher management page
 */
const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState(null)

  /**
   * Fetch vouchers
   */
  const fetchVouchers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/vouchers/admin/all', {
        withCredentials: true
      })
      setVouchers(response.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load vouchers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  /**
   * Handle delete voucher
   * @param {number} voucherId - Voucher ID
   */
  const handleDelete = async (voucherId) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) {
      return
    }

    try {
      await axios.delete(`/api/vouchers/${voucherId}`, {
        withCredentials: true
      })
      toast.success('Voucher deleted successfully')
      fetchVouchers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete voucher')
    }
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  /**
   * Check if voucher is active
   * @param {Object} voucher - Voucher object
   * @returns {boolean} True if active
   */
  const isVoucherActive = (voucher) => {
    if (!voucher.is_active) return false
    const now = new Date()
    const start = new Date(voucher.start_date)
    const end = new Date(voucher.end_date)
    return now >= start && now <= end
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading skeleton */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Voucher Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <FaTag className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Voucher Management</h1>
          </div>
          <Button
            onClick={() => {
              setEditingVoucher(null)
              setShowForm(true)
            }}
            icon={<FaPlus />}
          >
            Create Voucher
          </Button>
        </div>

        {/* Vouchers table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {/* Table header */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Voucher rows */}
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No vouchers found
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr key={voucher.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold">
                      {voucher.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voucher.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {voucher.discount_type === 'percentage'
                        ? `${voucher.discount_value}%`
                        : `$${voucher.discount_value}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(voucher.start_date)} - {formatDate(voucher.end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {voucher.current_usage_count}
                      {voucher.total_usage_limit ? ` / ${voucher.total_usage_limit}` : ' / ∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          isVoucherActive(voucher)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {isVoucherActive(voucher) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingVoucher(voucher)
                            setShowForm(true)
                          }}
                          icon={<FaEdit />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(voucher.id)}
                          icon={<FaTrash />}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Simple form modal (simplified - full form would be in separate component) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                {editingVoucher ? 'Edit Voucher' : 'Create Voucher'}
              </h2>
              <p className="text-gray-600 mb-4">
                Voucher form would be implemented here with full CRUD functionality.
                This is a placeholder for the form component.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setShowForm(false)
                    setEditingVoucher(null)
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default VoucherManagement

