/**
 * Comment Moderation Page Component
 * Admin page for managing product comments with full CRUD operations
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaComments, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'
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
 * CommentModeration component
 * @returns {JSX.Element} Comment moderation page
 * @author Thang Truong
 * @date 2025-12-17
 */
const CommentModeration = () => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isApprovedFilter, setIsApprovedFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, comment: null })
  const [actionLoading, setActionLoading] = useState({})

  const { selected: selectedComments, toggle, selectAll, clear, selectedCount } = useSelection(comments)

  /**
   * Fetch comments with search and filters
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchComments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', String(searchTerm))
      if (isApprovedFilter !== '') params.append('isApproved', isApprovedFilter)
      
      const response = await axios.get(`/api/admin/comments?${params}`)
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.comments) {
        setComments(response.data.comments || [])
        setTotalPages(pagination.pages || 1)
        setTotalItems(pagination.total || 0)
      } else {
        setComments([])
        setTotalPages(1)
        setTotalItems(0)
      }
      setInitialLoad(false)
    } catch (error) {
      // Handle errors gracefully - ensure pagination is always set
      const errorData = error.response?.data || {}
      const pagination = errorData.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      const errorMessage = errorData.message || 'No comments found matching your search'
      toast.error(errorMessage)
      setComments([])
      setTotalPages(pagination.pages || 1)
      setTotalItems(pagination.total || 0)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [page, entriesPerPage, searchTerm, isApprovedFilter, sortBy, sortOrder])

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
   * Handle approve comment
   * @param {number} commentId - Comment ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleApprove = async (commentId) => {
    try {
      setActionLoading({ ...actionLoading, [commentId]: true })
      await axios.post(`/api/comments/${commentId}/approve`, {}, {
        withCredentials: true
      })
      toast.success('Comment approved')
      fetchComments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve comment')
    } finally {
      setActionLoading({ ...actionLoading, [commentId]: false })
    }
  }

  /**
   * Handle reject comment
   * @param {number} commentId - Comment ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleReject = async (commentId) => {
    try {
      setActionLoading({ ...actionLoading, [commentId]: true })
      await axios.post(`/api/comments/${commentId}/reject`, {}, {
        withCredentials: true
      })
      toast.success('Comment rejected')
      fetchComments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject comment')
    } finally {
      setActionLoading({ ...actionLoading, [commentId]: false })
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleDeleteConfirm = async () => {
    try {
      setActionLoading({ ...actionLoading, [deleteModal.comment.id]: true })
      await axios.delete(`/api/admin/comments/${deleteModal.comment.id}`)
      toast.success('Comment deleted successfully')
      setDeleteModal({ isOpen: false, comment: null })
      fetchComments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment')
    } finally {
      setActionLoading({ ...actionLoading, [deleteModal.comment?.id]: false })
    }
  }

  /**
   * Handle bulk approve
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkApprove = async () => {
    try {
      const ids = Array.from(selectedComments)
      await axios.post('/api/admin/comments/bulk-approve', { commentIds: ids })
      toast.success(`${ids.length} comment(s) approved successfully`)
      clear()
      fetchComments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve comments')
    }
  }

  if (loading && initialLoad && comments.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Comment Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Comment management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaComments className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Comment Management</h1>
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
          filterValue={isApprovedFilter}
          onFilterChange={(value) => {
            setIsApprovedFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Comments' },
            { value: 'true', label: 'Approved' },
            { value: 'false', label: 'Pending' }
          ]}
          searchPlaceholder="Search comments by user, product, or comment text..."
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

        {/* Comments table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={comments.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Comment"
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
                  label="User"
                  field="user_name"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Comment"
                  field="comment"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Approved"
                  field="is_approved"
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
              {comments.length === 0 && !loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No comments found matching "${searchTerm}"` 
                          : 'No comments found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all comments.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                comments.map((comment, index) => (
                  <tr key={comment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <BulkSelectCheckbox
                        itemId={comment.id}
                        isSelected={selectedComments.has(comment.id)}
                        onToggle={toggle}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(page - 1) * entriesPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comment.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{comment.product_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{comment.user_name}</div>
                        <div className="text-gray-500 text-xs">{comment.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                      <p className="line-clamp-2">{comment.comment}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          comment.is_approved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comment.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(comment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(comment.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {!comment.is_approved && (
                          <button
                            onClick={() => handleApprove(comment.id)}
                            disabled={actionLoading[comment.id]}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            aria-label="Approve comment"
                          >
                            <FaCheck className="w-3 h-3" />
                            Approve
                          </button>
                        )}
                        {comment.is_approved && (
                          <button
                            onClick={() => handleReject(comment.id)}
                            disabled={actionLoading[comment.id]}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                            aria-label="Reject comment"
                          >
                            <FaTimes className="w-3 h-3" />
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, comment })}
                          disabled={actionLoading[comment.id]}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          aria-label="Delete comment"
                        >
                          <FaTrash className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
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
          entity={deleteModal.comment}
          entityType="comment"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, comment: null })}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[{ type: 'approve', label: 'Approve Selected' }]}
            onAction={(actionType) => actionType === 'approve' && handleBulkApprove()}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default CommentModeration
