/**
 * Order Management Page Component
 * Full CRUD operations for orders with filters, search, pagination, bulk actions
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import StatusBadge from '../../components/admin/StatusBadge'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import { useSelection } from '../../utils/useSelection'
import {
  updateOrderStatus,
  bulkUpdateOrders,
  deleteOrder,
} from '../../utils/dashboardCrud'

/**
 * OrderManagement component
 * @returns {JSX.Element} Order management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null })
  const { selected: selectedOrders, toggle, selectAll, clear, selectedCount } = useSelection(orders)

  /**
   * Fetch orders
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (statusFilter) params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      const response = await axios.get(`/api/admin/orders?${params}`)
      setOrders(response.data.orders || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter, searchTerm])

  /**
   * Format order number
   * @param {Object} order - Order object
   * @returns {string} Formatted order number
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatOrderNumber = (order) => {
    if (order.order_number) return order.order_number
    const date = new Date(order.created_at).toISOString().slice(0, 10).replace(/-/g, '')
    return `ORD-${date}-${String(order.id).padStart(5, '0')}`
  }

  /**
   * Get order status
   * @param {Object} order - Order object
   * @returns {string} Order status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getOrderStatus = (order) => {
    if (order.is_delivered) return 'delivered'
    if (order.is_paid) return 'paid'
    return 'pending'
  }

  /**
   * Handle status change
   * @param {number} orderId - Order ID
   * @param {string} newStatus - New status
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(deleteModal.order.id)
      setDeleteModal({ isOpen: false, order: null })
      fetchOrders()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle bulk action
   * @param {string} actionType - Action type
   * @param {Object} data - Action data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkAction = async (actionType, data) => {
    try {
      if (actionType === 'update-status') {
        await bulkUpdateOrders(Array.from(selectedOrders), { status: data.status })
      } else if (actionType === 'delete') {
        for (const id of selectedOrders) {
          await deleteOrder(id)
        }
      }
      clear()
      fetchOrders()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  if (loading && orders.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Order management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Management</h1>

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
            { value: '', label: 'All Orders' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'delivered', label: 'Delivered' }
          ]}
          searchPlaceholder="Search orders..."
        />

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={orders.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <BulkSelectCheckbox
                      itemId={order.id}
                      isSelected={selectedOrders.has(order.id)}
                      onToggle={toggle}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                      {formatOrderNumber(order)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      currentStatus={getOrderStatus(order)}
                      availableStatuses={['pending', 'processing', 'paid', 'delivered']}
                      onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                      entityType="order"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, order })}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete order"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        {/* Modals */}
        <ConfirmDeleteModal
          entity={deleteModal.order}
          entityType="order"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, order: null })}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[
              { type: 'update-status', label: 'Mark as Paid', data: { status: 'paid' } },
              { type: 'update-status', label: 'Mark as Delivered', data: { status: 'delivered' } },
              { type: 'delete', label: 'Delete Selected' },
            ]}
            onAction={handleBulkAction}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default OrderManagement
