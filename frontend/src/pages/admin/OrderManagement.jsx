/**
 * Order Management Page Component
 * Full CRUD operations for orders with filters, search, pagination, bulk actions
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaShoppingBag } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import StatusBadge from '../../components/admin/StatusBadge'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import { useSelection } from '../../utils/useSelection'
import { formatDate } from '../../utils/dateUtils'
import {
  updateOrderStatus,
  bulkUpdateOrders,
  deleteOrder,
} from '../../utils/dashboardCrud'

/**
 * OrderManagement component
 * @returns {JSX.Element} Order management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, order: null })
  const { selected: selectedOrders, toggle, selectAll, clear, selectedCount } = useSelection(orders)

  /**
   * Fetch orders
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (statusFilter) params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)
      const response = await axios.get(`/api/admin/orders?${params}`)
      if (response.data && response.data.orders) {
        setOrders(response.data.orders || [])
        setTotalPages(response.data.pagination?.pages || 1)
        setTotalItems(response.data.pagination?.total || 0)
      } else {
        setOrders([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load orders')
      setOrders([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [page, entriesPerPage, statusFilter, searchTerm, sortBy, sortOrder])

  /**
   * Handle sort
   * @param {string} field - Sort field
   * @param {string} order - Sort order
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSort = (field, order) => {
    setSortBy(field)
    setSortOrder(order)
    setPage(1)
  }

  /**
   * Format order number
   * @param {Object} order - Order object
   * @returns {string} Formatted order number
   * @author Thang Truong
   * @date 2025-12-17
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
   * @date 2025-12-17
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
   * @date 2025-12-17
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
   * @date 2025-12-17
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
   * @date 2025-12-17
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
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaShoppingBag className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Order Management</h1>
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
            { value: '', label: 'All Orders' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'delivered', label: 'Delivered' }
          ]}
          searchPlaceholder="Search orders..."
        />

        {/* Pagination top */}
        <Pagination
          position="top"
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

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Order"
                  field="id"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Order Number"
                  field="order_number"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="User ID"
                  field="user_id"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="User"
                  field="user_name"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Voucher ID"
                  field="voucher_id"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Voucher Discount"
                  field="voucher_discount"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Payment Method"
                  field="payment_method"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Payment Status"
                  field="payment_status"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Tax"
                  field="tax_price"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Shipping"
                  field="shipping_price"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Total"
                  field="total_price"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Paid"
                  field="is_paid"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Paid At"
                  field="paid_at"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Delivered"
                  field="is_delivered"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Delivered At"
                  field="delivered_at"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Created"
                  field="created_at"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Updated"
                  field="updated_at"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <BulkSelectCheckbox
                      itemId={order.id}
                      isSelected={selectedOrders.has(order.id)}
                      onToggle={toggle}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(page - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800">
                      {formatOrderNumber(order)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.voucher_id || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(order.voucher_discount || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.payment_method || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.payment_status || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(order.tax_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${parseFloat(order.shipping_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(order.total_price || 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.is_paid ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.paid_at ? formatDate(order.paid_at) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.is_delivered ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.delivered_at ? formatDate(order.delivered_at) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        currentStatus={getOrderStatus(order)}
                        availableStatuses={['pending', 'processing', 'paid', 'delivered']}
                        onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                        entityType="order"
                      />
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, order })}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        aria-label="Delete order"
                      >
                        <FaTrash className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
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
