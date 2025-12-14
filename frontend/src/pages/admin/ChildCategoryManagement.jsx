/**
 * Child Category Management Page
 * Full CRUD operations for child categories with filters, search, pagination
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
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import ChildCategoryCreateModal from '../../components/admin/ChildCategoryCreateModal'
import ChildCategoryEditModal from '../../components/admin/ChildCategoryEditModal'
import ChildCategoryTableRow from '../../components/admin/ChildCategoryTableRow'
import { useSelection } from '../../utils/useSelection'

/**
 * ChildCategoryManagement component
 * @returns {JSX.Element} Child category management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const ChildCategoryManagement = () => {
  const [childCategories, setChildCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [subcategoryFilter, setSubcategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, childCategory: null })
  const [editModal, setEditModal] = useState({ isOpen: false, childCategory: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const { selected: selectedChildCategories, toggle, selectAll, clear, selectedCount } = useSelection(childCategories)

  /**
   * Fetch subcategories for filter dropdown
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/products/subcategories')
      setSubcategories(response.data || [])
    } catch (error) {
      // Silently fail
    }
  }

  /**
   * Fetch child categories
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchChildCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      if (subcategoryFilter) params.append('subcategoryId', subcategoryFilter)
      const response = await axios.get(`/api/admin/child-categories?${params}`)
      setChildCategories(response.data.childCategories || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load child categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubcategories()
  }, [])

  useEffect(() => {
    fetchChildCategories()
  }, [page, searchTerm, subcategoryFilter])

  /**
   * Handle create child category
   * @param {Object} data - Child category data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCreate = async (data) => {
    try {
      await axios.post('/api/admin/child-categories', data)
      toast.success('Child category created successfully')
      setCreateModal({ isOpen: false })
      fetchChildCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create child category')
    }
  }

  /**
   * Handle update child category
   * @param {Object} data - Child category data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/admin/child-categories/${editModal.childCategory.id}`, data)
      toast.success('Child category updated successfully')
      setEditModal({ isOpen: false, childCategory: null })
      fetchChildCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update child category')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/child-categories/${deleteModal.childCategory.id}`)
      toast.success('Child category deleted successfully')
      setDeleteModal({ isOpen: false, childCategory: null })
      fetchChildCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete child category')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedChildCategories)
      await axios.post('/api/admin/child-categories/bulk-delete', { childCategoryIds: ids })
      toast.success(`${ids.length} child category(ies) deleted successfully`)
      clear()
      fetchChildCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete child categories')
    }
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Child Category Management</h1>
          <button
            onClick={() => setCreateModal({ isOpen: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPlus />
            Add Child Category
          </button>
        </div>

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
            ...subcategories.map(sub => ({ value: sub.id.toString(), label: `${sub.category_name} > ${sub.name}` }))
          ]}
          searchPlaceholder="Search child categories by name, description, category, or subcategory..."
        />

        {/* Child categories table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subcategory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {childCategories.map((childCategory) => (
                <ChildCategoryTableRow
                  key={childCategory.id}
                  childCategory={childCategory}
                  isSelected={selectedChildCategories.has(childCategory.id)}
                  onToggle={toggle}
                  onEdit={() => setEditModal({ isOpen: true, childCategory })}
                  onDelete={() => setDeleteModal({ isOpen: true, childCategory })}
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

        {/* Create modal */}
        <ChildCategoryCreateModal
          subcategories={subcategories}
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSave={handleCreate}
        />

        {/* Edit modal */}
        <ChildCategoryEditModal
          childCategory={editModal.childCategory}
          subcategories={subcategories}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, childCategory: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.childCategory}
          entityType="child category"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, childCategory: null })}
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
