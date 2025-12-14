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
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import QuickCreateModal from '../../components/admin/QuickCreateModal'
import { useSelection } from '../../utils/useSelection'

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
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null })
  const [editModal, setEditModal] = useState({ isOpen: false, category: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const { selected: selectedCategories, toggle, selectAll, clear, selectedCount } = useSelection(categories)

  /**
   * Fetch categories
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      const response = await axios.get(`/api/admin/categories?${params}`)
      setCategories(response.data.categories || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [page, searchTerm])

  /**
   * Handle create category
   * @param {Object} data - Category data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCreate = async (data) => {
    try {
      await axios.post('/api/admin/categories', data)
      toast.success('Category created successfully')
      setCreateModal({ isOpen: false })
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category')
    }
  }

  /**
   * Handle update category
   * @param {Object} data - Category data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/admin/categories/${editModal.category.id}`, data)
      toast.success('Category updated successfully')
      setEditModal({ isOpen: false, category: null })
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/categories/${deleteModal.category.id}`)
      toast.success('Category deleted successfully')
      setDeleteModal({ isOpen: false, category: null })
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedCategories)
      await axios.post('/api/admin/categories/bulk-delete', { categoryIds: ids })
      toast.success(`${ids.length} category(ies) deleted successfully`)
      clear()
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete categories')
    }
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
            onClick={() => setCreateModal({ isOpen: true })}
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

        {/* Categories table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.has(category.id)}
                  onToggle={toggle}
                  onEdit={() => setEditModal({ isOpen: true, category })}
                  onDelete={() => setDeleteModal({ isOpen: true, category })}
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
        <QuickCreateModal
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSubmit={handleCreate}
          title="Create Category"
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' }
          ]}
        />

        {/* Edit modal */}
        <CategoryEditModal
          category={editModal.category}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, category: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.category}
          entityType="category"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, category: null })}
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
