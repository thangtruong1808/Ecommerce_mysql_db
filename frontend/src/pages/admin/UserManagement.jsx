/**
 * User Management Page Component
 * Full CRUD operations for users with filters, search, pagination, bulk actions
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaPlus } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import QuickCreateModal from '../../components/admin/QuickCreateModal'
import InlineEditCell from '../../components/admin/InlineEditCell'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import { useSelection } from '../../utils/useSelection'
import {
  quickCreateUser,
  updateUserRole,
  deleteUser,
} from '../../utils/dashboardCrud'

/**
 * UserManagement component
 * @returns {JSX.Element} User management page
 * @author Thang Truong
 * @date 2025-12-12
 */
const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const { selected: selectedUsers, toggle, selectAll, clear, selectedCount } = useSelection(users)

  /**
   * Fetch users
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      const response = await axios.get(`/api/admin/users?${params}`)
      setUsers(response.data.users || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, searchTerm, roleFilter])

  /**
   * Handle role change
   * @param {number} userId - User ID
   * @param {string} newRole - New role
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole)
      fetchUsers()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle create success
   * @param {Object} data - User data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCreateSuccess = async (data) => {
    try {
      await quickCreateUser(data)
      setCreateModal({ isOpen: false })
      fetchUsers()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(deleteModal.user.id)
      setDeleteModal({ isOpen: false, user: null })
      fetchUsers()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* User management page */
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setCreateModal({ isOpen: true })}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Add User
          </button>
        </div>

        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          filterValue={roleFilter}
          onFilterChange={(value) => {
            setRoleFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Roles' },
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' }
          ]}
          searchPlaceholder="Search users..."
        />

        {/* Users table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={users.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <BulkSelectCheckbox
                      itemId={user.id}
                      isSelected={selectedUsers.has(user.id)}
                      onToggle={toggle}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineEditCell
                      value={user.role}
                      type="select"
                      options={[
                        { value: 'user', label: 'User' },
                        { value: 'admin', label: 'Admin' }
                      ]}
                      onSave={(newRole) => handleRoleChange(user.id, newRole)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, user })}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
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

        {/* Modals */}
        <ConfirmDeleteModal
          entity={deleteModal.user}
          entityType="user"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, user: null })}
        />

        <QuickCreateModal
          type="user"
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSuccess={handleCreateSuccess}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[
              { type: 'update-role', label: 'Update Role', data: { role: 'admin' } },
              { type: 'delete', label: 'Delete Selected' },
            ]}
            onAction={(actionType, data) => {
              if (actionType === 'update-role') {
                Promise.all(Array.from(selectedUsers).map(id => updateUserRole(id, data.role)))
                  .then(() => {
                    clear()
                    fetchUsers()
                  })
              } else if (actionType === 'delete') {
                Promise.all(Array.from(selectedUsers).map(id => deleteUser(id)))
                  .then(() => {
                    clear()
                    fetchUsers()
                  })
              }
            }}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default UserManagement
