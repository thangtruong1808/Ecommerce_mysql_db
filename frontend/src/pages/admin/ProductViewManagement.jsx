/**
 * Product View Management Page
 * Full CRUD operations for product views with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaEye, FaTrash, FaUser, FaUserSlash } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import { useSelection } from '../../utils/useSelection'
import { formatDate } from '../../utils/dateUtils'

/**
 * ProductViewManagement component
 * @returns {JSX.Element} Product view management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const ProductViewManagement = () => {
  const [views, setViews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('viewed_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, view: null })
  const { selected: selectedViews, toggle, selectAll, clear, selectedCount } = useSelection(views)

  /**
   * Fetch product views
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchViews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', searchTerm)
      if (userTypeFilter) params.append('userType', userTypeFilter)
      const response = await axios.get(`/api/admin/product-views?${params}`)
      if (response.data && response.data.views) {
        setViews(response.data.views || [])
        setTotalPages(response.data.pagination?.pages || 1)
        setTotalItems(response.data.pagination?.total || 0)
      } else {
        setViews([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load product views')
      setViews([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchViews()
  }, [page, entriesPerPage, searchTerm, userTypeFilter, sortBy, sortOrder])

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
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/product-views/${deleteModal.view.id}`)
      toast.success('Product view deleted successfully')
      setDeleteModal({ isOpen: false, view: null })
      fetchViews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product view')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedViews)
      await axios.delete('/api/admin/product-views', { data: { ids } })
      toast.success(`${ids.length} product view(s) deleted successfully`)
      clear()
      fetchViews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product views')
    }
  }

  if (loading && views.length === 0) {
    return (
      /* Loading skeleton */
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Product View Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Product view management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Product View Management</h1>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          filterValue={userTypeFilter}
          onFilterChange={(value) => {
            setUserTypeFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Users' },
            { value: 'authenticated', label: 'Authenticated' },
            { value: 'guest', label: 'Guest' }
          ]}
          searchPlaceholder="Search by product, user, or session..."
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

        {/* Views table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <BulkSelectCheckbox
                      isSelectAll
                      totalItems={views.length}
                      selectedCount={selectedCount}
                      onSelectAll={selectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <SortableTableHeader
                    label="ID"
                    field="id"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Product"
                    field="product_name"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="User Type"
                    field="user_id"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="User/Session"
                    field="viewed_at"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableTableHeader
                    label="Viewed At"
                    field="viewed_at"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {views.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No product views found
                    </td>
                  </tr>
                ) : (
                  views.map((view, index) => (
                    <tr key={view.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <BulkSelectCheckbox
                          isSelected={selectedViews.has(view.id)}
                          onToggle={() => toggle(view.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(page - 1) * entriesPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {view.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/products/${view.product_id}`} className="flex items-center space-x-2 hover:text-blue-600">
                          {view.product_image && (
                            <img src={view.product_image} alt={view.product_name} className="w-10 h-10 object-cover rounded" />
                          )}
                          <span className="text-sm font-medium">{view.product_name || `Product #${view.product_id}`}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {view.user_id ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FaUser className="mr-1" />
                            Authenticated
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <FaUserSlash className="mr-1" />
                            Guest
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {view.user_id ? (
                          <div>
                            <div className="font-medium">{view.user_name || 'Unknown'}</div>
                            <div className="text-xs">{view.user_email || ''}</div>
                          </div>
                        ) : (
                          <div className="text-xs font-mono">{view.session_id?.substring(0, 8)}...</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(view.viewed_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, view })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.view}
          entityType="product view"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, view: null })}
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

export default ProductViewManagement
