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
  const [totalPages, setTotalPages] = useState(1)
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
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('userId', searchTerm)
      const response = await axios.get(`/api/admin/carts?${params}`)
      setCarts(response.data.carts || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load carts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [page, searchTerm])

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

        {/* Carts table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carts.map((cart) => (
                <CartTableRow
                  key={cart.id}
                  cart={cart}
                  isSelected={selectedCarts.has(cart.id)}
                  onToggle={toggle}
                  onView={() => handleView(cart.id)}
                  onDelete={() => setDeleteModal({ isOpen: true, cart })}
                />
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
