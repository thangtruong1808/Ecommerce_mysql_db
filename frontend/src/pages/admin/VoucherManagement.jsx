/**
 * Voucher Management Page Component
 * Admin page for managing vouchers
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaTag } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import Button from '../../components/Button'

/**
 * VoucherManagement component
 * @returns {JSX.Element} Voucher management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   * @author Thang Truong
   * @date 2025-12-17
   */
  /**
   * Fetch vouchers with search and filter
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchVouchers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page,
        limit: entriesPerPage
      })
      if (searchTerm) params.append('search', String(searchTerm))
      if (statusFilter) params.append('status', statusFilter)
      const response = await axios.get(`/api/vouchers/admin/all?${params}`, {
        withCredentials: true
      })
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.vouchers) {
        setVouchers(response.data.vouchers || [])
        setTotalPages(pagination.pages || 1)
        setTotalItems(pagination.total || 0)
      } else {
        setVouchers([])
        setTotalPages(1)
        setTotalItems(0)
      }
      setInitialLoad(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No vouchers found matching your search'
      toast.error(errorMessage)
      setVouchers([])
      setTotalPages(1)
      setTotalItems(0)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch vouchers when filters change
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    fetchVouchers()
  }, [page, entriesPerPage, searchTerm, statusFilter])

  /**
   * Handle delete voucher event
   * @param {number} voucherId - Voucher ID to delete
   * @author Thang Truong
   * @date 2025-12-17
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
   * @author Thang Truong
   * @date 2025-12-17
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  /**
   * Check if voucher is active
   * @param {Object} voucher - Voucher object
   * @returns {boolean} True if active
   * @author Thang Truong
   * @date 2025-12-17
   */
  const isVoucherActive = (voucher) => {
    if (!voucher.is_active) return false
    const now = new Date()
    const start = new Date(voucher.start_date)
    const end = new Date(voucher.end_date)
    return now >= start && now <= end
  }

  if (loading && initialLoad && vouchers.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto ">
          {/* Loading skeleton */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Voucher Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Voucher management page with search and filters */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaTag className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Voucher Management</h1>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
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
        </div>

        {/* Divider between header and filters */}
        <div className="my-2 mb-4"><hr /></div>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          filterValue={statusFilter}
          onFilterChange={(value) => {
            setStatusFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'expired', label: 'Expired' }
          ]}
          searchPlaceholder="Search vouchers by code..."
        />

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
              {vouchers.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No vouchers found matching "${searchTerm}"` 
                          : 'No vouchers found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all vouchers.
                        </p>
                      )}
                    </div>
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

        {/* Pagination bottom */}
        <Pagination
          position="bottom"
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          entriesPerPage={entriesPerPage}
          onPageChange={setPage}
          onEntriesChange={(value) => {
            setEntriesPerPage(value)
            setPage(1)
          }}
        />

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

