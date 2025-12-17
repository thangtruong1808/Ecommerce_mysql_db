/**
 * Category Management Page
 * Full CRUD operations for categories with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus, FaTags } from 'react-icons/fa'
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
 * @date 2025-12-17
 */
const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const { selected: selectedCategories, toggle, selectAll, clear, selectedCount } = useSelection(categories)

  /**
   * Fetch categories with search and filters
   * @author Thang Truong
   * @date 2025-12-17
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
      if (searchTerm) params.append('search', String(searchTerm))
      const response = await axios.get(`/api/admin/categories?${params}`)
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.categories) {
        setCategories(response.data.categories || [])
        setTotalPages(pagination.pages || 1)
        setTotalItems(pagination.total || 0)
      } else {
        setCategories([])
        setTotalPages(1)
        setTotalItems(0)
      }
      setInitialLoad(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No categories found matching your search'
      toast.error(errorMessage)
      setCategories([])
      setTotalPages(1)
      setTotalItems(0)
      setInitialLoad(false)
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
   * @date 2025-12-17
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
   * @date 2025-12-17
   */
  const handleUpdate = async (data) => {
    if (!crud.editModal.entity) return
    await crud.handleUpdate(crud.editModal.entity.id, data)
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkDelete = async () => {
    const ids = Array.from(selectedCategories)
    await crud.handleBulkDelete(ids, '/api/admin/categories/bulk-delete', 'categoryIds')
    clear()
  }

  if (loading && initialLoad && categories.length === 0) {
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
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaTags className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Category Management</h1>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
            <button
              onClick={() => crud.setCreateModal({ isOpen: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaPlus />
              Add Category
            </button>
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
              {categories.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No categories found matching "${searchTerm}"` 
                          : 'No categories found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all categories.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <CategoryTableRow
                  key={category.id}
                  category={category}
                  index={(page - 1) * entriesPerPage + index + 1}
                  isSelected={selectedCategories.has(category.id)}
                  onToggle={toggle}
                  onEdit={() => crud.setEditModal({ isOpen: true, entity: category })}
                  onDelete={() => crud.setDeleteModal({ isOpen: true, entity: category })}
                  />
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
