/**
 * Child Category Management Page
 * Full CRUD operations for child categories with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus, FaLayerGroup } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import ChildCategoryCreateModal from '../../components/admin/ChildCategoryCreateModal'
import ChildCategoryEditModal from '../../components/admin/ChildCategoryEditModal'
import ChildCategoryTableRow from '../../components/admin/ChildCategoryTableRow'
import { useSelection } from '../../utils/useSelection'
import { useCrudOperations } from '../../utils/useCrudOperations'

/**
 * ChildCategoryManagement component
 * @returns {JSX.Element} Child category management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const ChildCategoryManagement = () => {
  const [childCategories, setChildCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [subcategoryFilter, setSubcategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const { selected: selectedChildCategories, toggle, selectAll, clear, selectedCount } = useSelection(childCategories)

  /**
   * Fetch child categories
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchChildCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', searchTerm)
      if (subcategoryFilter) params.append('subcategoryId', subcategoryFilter)
      const response = await axios.get(`/api/admin/child-categories?${params}`)
      if (response.data && response.data.childCategories) {
        setChildCategories(response.data.childCategories || [])
        setTotalPages(response.data.pagination?.pages || 1)
        setTotalItems(parseInt(response.data.pagination?.total) || 0)
      } else {
        setChildCategories([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load child categories')
      setChildCategories([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  const crud = useCrudOperations('/api/admin/child-categories', fetchChildCategories)

  /**
   * Fetch subcategories for filter dropdown
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/products/subcategories')
      setSubcategories(response.data || [])
    } catch (error) {
      // Silently fail
    }
  }

  useEffect(() => {
    fetchSubcategories()
  }, [])

  useEffect(() => {
    fetchChildCategories()
  }, [page, entriesPerPage, searchTerm, subcategoryFilter, sortBy, sortOrder])

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
   * Handle update child category
   * @param {Object} data - Child category data
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
    const ids = Array.from(selectedChildCategories)
    await crud.handleBulkDelete(ids, '/api/admin/child-categories/bulk-delete', 'childCategoryIds')
    clear()
  }

  if (loading && childCategories.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Child Category Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Child category management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaLayerGroup className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Child Category Management</h1>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
            <button
              onClick={() => crud.setCreateModal({ isOpen: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaPlus />
              Add Child Category
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
          filterValue={subcategoryFilter}
          onFilterChange={(value) => {
            setSubcategoryFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Subcategories' },
            ...subcategories.map(sub => ({ value: sub.id.toString(), label: `${sub.category_name} - ${sub.name}` }))
          ]}
          searchPlaceholder="Search child categories by name, description, category, or subcategory..."
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

        {/* Child categories table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={childCategories.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Child Category"
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
                  label="Category"
                  field="category_name"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Subcategory"
                  field="subcategory_name"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Subcategory ID"
                  field="subcategory_id"
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
              {childCategories.map((childCategory, index) => (
                <ChildCategoryTableRow
                  key={childCategory.id}
                  childCategory={childCategory}
                  index={(page - 1) * entriesPerPage + index + 1}
                  isSelected={selectedChildCategories.has(childCategory.id)}
                  onToggle={toggle}
                  onEdit={() => crud.setEditModal({ isOpen: true, entity: childCategory })}
                  onDelete={() => crud.setDeleteModal({ isOpen: true, entity: childCategory })}
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
        <ChildCategoryCreateModal
          subcategories={subcategories}
          isOpen={crud.createModal.isOpen}
          onClose={() => crud.setCreateModal({ isOpen: false })}
          onSave={crud.handleCreate}
        />

        {/* Edit modal */}
        <ChildCategoryEditModal
          childCategory={crud.editModal.entity}
          subcategories={subcategories}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="child category"
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

export default ChildCategoryManagement
