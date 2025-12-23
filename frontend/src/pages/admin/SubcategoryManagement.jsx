/**
 * Subcategory Management Page
 * Full CRUD operations for subcategories with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaPlus, FaList } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import SubcategoryCreateModal from '../../components/admin/SubcategoryCreateModal'
import SubcategoryEditModal from '../../components/admin/SubcategoryEditModal'
import SubcategoryTableRow from '../../components/admin/SubcategoryTableRow'
import { useSelection } from '../../utils/useSelection'
import { useCrudOperations } from '../../utils/useCrudOperations'

/**
 * SubcategoryManagement component
 * @returns {JSX.Element} Subcategory management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const { selected: selectedSubcategories, toggle, selectAll, clear, selectedCount } = useSelection(subcategories)

  /**
   * Fetch subcategories with search and filters
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchSubcategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', String(searchTerm))
      if (categoryFilter) params.append('categoryId', categoryFilter)
      const response = await axios.get(`/api/admin/subcategories?${params}`)
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.subcategories) {
        setSubcategories(response.data.subcategories || [])
        setTotalPages(pagination.pages || 1)
        setTotalItems(parseInt(pagination.total) || 0)
      } else {
        setSubcategories([])
        setTotalPages(1)
        setTotalItems(0)
      }
      setInitialLoad(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No subcategories found matching your search'
      toast.error(errorMessage)
      setSubcategories([])
      setTotalPages(1)
      setTotalItems(0)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  const crud = useCrudOperations('/api/admin/subcategories', fetchSubcategories)

  /**
   * Handle subcategory creation with photo upload
   * @param {Object} data - Subcategory data
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleCreateSubcategory = async (data) => {
    try {
      const formData = new FormData()
      formData.append('category_id', data.category_id)
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      if (data.photo) formData.append('photo', data.photo)
      
      await axios.post('/api/admin/subcategories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Subcategory created successfully')
      crud.setCreateModal({ isOpen: false })
      fetchSubcategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subcategory')
    }
  }

  /**
   * Fetch categories for filter dropdown
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories')
      setCategories(response.data || [])
    } catch (error) {
      // Silently fail
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchSubcategories()
  }, [page, entriesPerPage, searchTerm, categoryFilter, sortBy, sortOrder])

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
   * Handle update subcategory
   * @param {Object} data - Subcategory data
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
    const ids = Array.from(selectedSubcategories)
    await crud.handleBulkDelete(ids, '/api/admin/subcategories/bulk-delete', 'subcategoryIds')
    clear()
  }

  if (loading && initialLoad && subcategories.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Subcategory Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Subcategory management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaList className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Subcategory Management</h1>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
            <button
              onClick={() => crud.setCreateModal({ isOpen: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaPlus />
              Add Subcategory
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
          filterValue={categoryFilter}
          onFilterChange={(value) => {
            setCategoryFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Categories' },
            ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
          ]}
          searchPlaceholder="Search subcategories by name, description, or category..."
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

        {/* Subcategories table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={subcategories.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Subcategory"
                  field="id"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
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
                  label="Category ID"
                  field="category_id"
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
              {subcategories.length === 0 && !loading ? (
                <tr>
                  <td colSpan="11" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No subcategories found matching "${searchTerm}"` 
                          : 'No subcategories found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all subcategories.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                subcategories.map((subcategory, index) => (
                  <SubcategoryTableRow
                  key={subcategory.id}
                  subcategory={subcategory}
                  index={(page - 1) * entriesPerPage + index + 1}
                  isSelected={selectedSubcategories.has(subcategory.id)}
                  onToggle={toggle}
                  onEdit={() => crud.setEditModal({ isOpen: true, entity: subcategory })}
                  onDelete={() => crud.setDeleteModal({ isOpen: true, entity: subcategory })}
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
        <SubcategoryCreateModal
          categories={categories}
          isOpen={crud.createModal.isOpen}
          onClose={() => crud.setCreateModal({ isOpen: false })}
          onSave={handleCreateSubcategory}
        />

        {/* Edit modal */}
        <SubcategoryEditModal
          subcategory={crud.editModal.entity}
          categories={categories}
          isOpen={crud.editModal.isOpen}
          onClose={() => crud.setEditModal({ isOpen: false, entity: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={crud.deleteModal.entity}
          entityType="subcategory"
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

export default SubcategoryManagement
