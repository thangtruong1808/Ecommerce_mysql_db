/**
 * Subcategory Management Page
 * Full CRUD operations for subcategories with filters, search, pagination
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
import SubcategoryCreateModal from '../../components/admin/SubcategoryCreateModal'
import SubcategoryEditModal from '../../components/admin/SubcategoryEditModal'
import SubcategoryTableRow from '../../components/admin/SubcategoryTableRow'
import { useSelection } from '../../utils/useSelection'

/**
 * SubcategoryManagement component
 * @returns {JSX.Element} Subcategory management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, subcategory: null })
  const [editModal, setEditModal] = useState({ isOpen: false, subcategory: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const { selected: selectedSubcategories, toggle, selectAll, clear, selectedCount } = useSelection(subcategories)

  /**
   * Fetch categories for filter dropdown
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories')
      setCategories(response.data || [])
    } catch (error) {
      // Silently fail - categories not critical for subcategory page
    }
  }

  /**
   * Fetch subcategories
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchSubcategories = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter) params.append('categoryId', categoryFilter)
      const response = await axios.get(`/api/admin/subcategories?${params}`)
      setSubcategories(response.data.subcategories || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load subcategories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchSubcategories()
  }, [page, searchTerm, categoryFilter])

  /**
   * Handle create subcategory
   * @param {Object} data - Subcategory data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCreate = async (data) => {
    try {
      await axios.post('/api/admin/subcategories', data)
      toast.success('Subcategory created successfully')
      setCreateModal({ isOpen: false })
      fetchSubcategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subcategory')
    }
  }

  /**
   * Handle update subcategory
   * @param {Object} data - Subcategory data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/admin/subcategories/${editModal.subcategory.id}`, data)
      toast.success('Subcategory updated successfully')
      setEditModal({ isOpen: false, subcategory: null })
      fetchSubcategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subcategory')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/subcategories/${deleteModal.subcategory.id}`)
      toast.success('Subcategory deleted successfully')
      setDeleteModal({ isOpen: false, subcategory: null })
      fetchSubcategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete subcategory')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedSubcategories)
      await axios.post('/api/admin/subcategories/bulk-delete', { subcategoryIds: ids })
      toast.success(`${ids.length} subcategory(ies) deleted successfully`)
      clear()
      fetchSubcategories()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete subcategories')
    }
  }

  if (loading && subcategories.length === 0) {
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Subcategory Management</h1>
          <button
            onClick={() => setCreateModal({ isOpen: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPlus />
            Add Subcategory
          </button>
        </div>

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

        {/* Subcategories table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subcategories.map((subcategory) => (
                <SubcategoryTableRow
                  key={subcategory.id}
                  subcategory={subcategory}
                  isSelected={selectedSubcategories.has(subcategory.id)}
                  onToggle={toggle}
                  onEdit={() => setEditModal({ isOpen: true, subcategory })}
                  onDelete={() => setDeleteModal({ isOpen: true, subcategory })}
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
        <SubcategoryCreateModal
          categories={categories}
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSave={handleCreate}
        />

        {/* Edit modal */}
        <SubcategoryEditModal
          subcategory={editModal.subcategory}
          categories={categories}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, subcategory: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.subcategory}
          entityType="subcategory"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, subcategory: null })}
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
