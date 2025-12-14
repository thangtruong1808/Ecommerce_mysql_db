/**
 * Category Management Page
 * Full CRUD operations for categories with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import QuickCreateModal from '../../components/admin/QuickCreateModal'
import CategoryEditModal from '../../components/admin/CategoryEditModal'
import CategoryTableRow from '../../components/admin/CategoryTableRow'
import { useSelection } from '../../utils/useSelection'
import { useCrudOperations } from '../../utils/useCrudOperations'

/**
 * CategoryManagement component
 * @returns {JSX.Element} Category management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const { selected: selectedCategories, toggle, selectAll, clear, selectedCount } = useSelection(categories)

  /**
   * Fetch categories
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', searchTerm)
      const response = await axios.get(`/api/admin/categories?${params}`)
      setCategories(response.data.categories || [])
      setTotalPages(response.data.pagination?.pages || 1)
      setTotalItems(response.data.pagination?.total || 0)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const crud = useCrudOperations('/api/admin/categories', fetchCategories)

  useEffect(() => {
    fetchCategories()
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
   * Handle update category
   * @param {Object} data - Category data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpdate = async (data) => {
    if (!crud.editModal.entity) return
    await crud.handleUpdate(crud.editModal.entity.id, data)
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    const ids = Array.from(selectedCategories)
    await crud.handleBulkDelete(ids, '/api/admin/categories/bulk-delete', 'categoryIds')
    clear()
  }

  if (loading && categories.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Category Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Category management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <button
            onClick={() => crud.setCreateModal({ isOpen: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPlus />
            Add Category
          </button>
        </div>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          searchPlaceholder="Search categories by name or description..."
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

        {/* Categories table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={categories.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Category"
                  field="id"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Name"
                  field="name"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Description"
                  field="description"
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
              {categories.map((category, index) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  index={(page - 1) * entriesPerPage + index + 1}
                  isSelected={selectedCategories.has(category.id)}
                  onToggle={toggle}
                  onEdit={() => crud.setEditModal({ isOpen: true, entity: category })}
                  onDelete={() => crud.setDeleteModal({ isOpen: true, entity: category })}
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

        {/* Create modal */}
        <QuickCreateModal
          isOpen={crud.createModal.isOpen}
          onClose={() => crud.setCreateModal({ isOpen: false })}
          onSubmit={crud.handleCreate}
          title="Create Category"
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' }
          ]}
        />

        {/* Edit modal */}
        <CategoryEditModal
          category={crud.editModal.entity}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="category"
          isOpen={crud.deleteModal.isOpen}
          onConfirm={crud.handleDeleteConfirm}
          onCancel={() => crud.setDeleteModal({ isOpen: false, entity: null })}
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

export default CategoryManagement
