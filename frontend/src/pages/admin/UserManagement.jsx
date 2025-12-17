/**
 * User Management Page Component
 * Full CRUD operations for users with filters, search, pagination, bulk actions
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaPlus, FaEdit, FaUsers } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import QuickCreateModal from '../../components/admin/QuickCreateModal'
import UserEditModal from '../../components/admin/UserEditModal'
import InlineEditCell from '../../components/admin/InlineEditCell'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import { useSelection } from '../../utils/useSelection'
import { formatDate } from '../../utils/dateUtils'
import {
  quickCreateUser,
  updateUserRole,
  deleteUser,
} from '../../utils/dashboardCrud'

/**
 * UserManagement component
 * @returns {JSX.Element} User management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null })
  const [editModal, setEditModal] = useState({ isOpen: false, user: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const { selected: selectedUsers, toggle, selectAll, clear, selectedCount } = useSelection(users)

  /**
   * Fetch users
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', searchTerm)
      if (roleFilter) params.append('role', roleFilter)
      const response = await axios.get(`/api/admin/users?${params}`)
      if (response.data && response.data.users) {
        setUsers(response.data.users || [])
        setTotalPages(response.data.pagination?.pages || 1)
        setTotalItems(response.data.pagination?.total || 0)
      } else {
        setUsers([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load users')
      setUsers([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, entriesPerPage, searchTerm, roleFilter, sortBy, sortOrder])

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
   * Handle role change
   * @param {number} userId - User ID
   * @param {string} newRole - New role
   * @author Thang Truong
   * @date 2025-12-17
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
   * @date 2025-12-17
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
   * Handle update user
   * @param {Object} data - User data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleUpdate = async (data) => {
    try {
      if (!editModal.user) return
      await axios.put(`/api/admin/users/${editModal.user.id}`, data)
      toast.success('User updated successfully')
      setEditModal({ isOpen: false, user: null })
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
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


  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* User management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaUsers className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">User Management</h1>
          </div>
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0">
            <button
              onClick={() => setCreateModal({ isOpen: true })}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Add User
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

        {/* Users table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID User"
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
                  label="Email"
                  field="email"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Role"
                  field="role"
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
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <BulkSelectCheckbox
                      itemId={user.id}
                      isSelected={selectedUsers.has(user.id)}
                      onToggle={toggle}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(page - 1) * entriesPerPage + index + 1}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditModal({ isOpen: true, user })}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        aria-label="Edit user"
                      >
                        <FaEdit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, user })}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        aria-label="Delete user"
                      >
                        <FaTrash className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
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

        {/* Modals */}
        <UserEditModal
          user={editModal.user}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, user: null })}
          onSave={handleUpdate}
        />

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
