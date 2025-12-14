/**
 * Cart Management Page
 * Full CRUD operations for carts with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import CartViewModal from '../../components/admin/CartViewModal'
import CartTableRow from '../../components/admin/CartTableRow'
import { useSelection } from '../../utils/useSelection'

/**
 * CartManagement component
 * @returns {JSX.Element} Cart management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const CartManagement = () => {
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cart: null })
  const [viewModal, setViewModal] = useState({ isOpen: false, cart: null })
  const { selected: selectedCarts, toggle, selectAll, clear, selectedCount } = useSelection(carts)

  /**
   * Fetch carts
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchCarts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('userId', searchTerm)
      const response = await axios.get(`/api/admin/carts?${params}`)
      setCarts(response.data.carts || [])
      setTotalPages(response.data.pagination?.pages || 1)
      setTotalItems(response.data.pagination?.total || 0)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load carts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [page, entriesPerPage, searchTerm, sortBy, sortOrder])

  /**
   * Handle sort
   * @param {string} field - Sort field
   * @param {string} order - Sort order
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSort = (field, order) => {
    setSortBy(field)
    setSortOrder(order)
    setPage(1)
  }

  /**
   * Handle view cart details
   * @param {number} cartId - Cart ID
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleView = async (cartId) => {
    try {
      const response = await axios.get(`/api/admin/carts/${cartId}`)
      setViewModal({ isOpen: true, cart: response.data })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load cart details')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/carts/${deleteModal.cart.id}`)
      toast.success('Cart deleted successfully')
      setDeleteModal({ isOpen: false, cart: null })
      fetchCarts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete cart')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedCarts)
      await axios.post('/api/admin/carts/bulk-delete', { cartIds: ids })
      toast.success(`${ids.length} cart(s) deleted successfully`)
      clear()
      fetchCarts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete carts')
    }
  }


  if (loading && carts.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Cart management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cart Management</h1>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          searchPlaceholder="Search by user ID..."
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

        {/* Carts table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={carts.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Cart"
                  field="id"
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
                  label="Items"
                  field="item_count"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Total Value"
                  field="total_value"
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
              {carts.map((cart, index) => (
                <CartTableRow
                  key={cart.id}
                  cart={cart}
                  index={(page - 1) * entriesPerPage + index + 1}
                  isSelected={selectedCarts.has(cart.id)}
                  onToggle={toggle}
                  onView={() => handleView(cart.id)}
                  onDelete={() => setDeleteModal({ isOpen: true, cart })}
                />
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

        {/* View modal */}
        <CartViewModal
          cart={viewModal.cart}
          isOpen={viewModal.isOpen}
          onClose={() => setViewModal({ isOpen: false, cart: null })}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.cart}
          entityType="cart"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, cart: null })}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[{ type: 'delete', label: 'Delete Selected' }]}
            onAction={(actionType) => actionType === 'delete' && handleBulkDelete()}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default CartManagement
