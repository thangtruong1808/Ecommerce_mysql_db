/**
 * Review Management Page
 * Full CRUD operations for reviews with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import ReviewEditModal from '../../components/admin/ReviewEditModal'
import ReviewTableRow from '../../components/admin/ReviewTableRow'
import { useSelection } from '../../utils/useSelection'

/**
 * ReviewManagement component
 * @returns {JSX.Element} Review management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const ReviewManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, review: null })
  const [editModal, setEditModal] = useState({ isOpen: false, review: null })
  const { selected: selectedReviews, toggle, selectAll, clear, selectedCount } = useSelection(reviews)

  /**
   * Fetch reviews with search and filters
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', String(searchTerm))
      if (ratingFilter) params.append('rating', ratingFilter)
      const response = await axios.get(`/api/admin/reviews?${params}`)
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: entriesPerPage, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.reviews) {
        setReviews(response.data.reviews || [])
        setTotalPages(pagination.pages || 1)
        setTotalItems(pagination.total || 0)
      } else {
        setReviews([])
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
      const errorMessage = errorData.message || 'No reviews found matching your search'
      toast.error(errorMessage)
      setReviews([])
      setTotalPages(pagination.pages || 1)
      setTotalItems(pagination.total || 0)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [page, entriesPerPage, searchTerm, ratingFilter, sortBy, sortOrder])

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
   * Handle update review
   * @param {Object} data - Review data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleUpdate = async (data) => {
    try {
      await axios.put(`/api/admin/reviews/${editModal.review.id}`, data)
      toast.success('Review updated successfully')
      setEditModal({ isOpen: false, review: null })
      fetchReviews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review')
    }
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/reviews/${deleteModal.review.id}`)
      toast.success('Review deleted successfully')
      setDeleteModal({ isOpen: false, review: null })
      fetchReviews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review')
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedReviews)
      for (const id of ids) {
        await axios.delete(`/api/admin/reviews/${id}`)
      }
      toast.success(`${ids.length} review(s) deleted successfully`)
      clear()
      fetchReviews()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete reviews')
    }
  }


  if (loading && initialLoad && reviews.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Review Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Review management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaStar className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Review Management</h1>
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
          filterValue={ratingFilter}
          onFilterChange={(value) => {
            setRatingFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Ratings' },
            { value: '5', label: '5 Stars' },
            { value: '4', label: '4 Stars' },
            { value: '3', label: '3 Stars' },
            { value: '2', label: '2 Stars' },
            { value: '1', label: '1 Star' }
          ]}
          searchPlaceholder="Search by user, product, or comment..."
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

        {/* Reviews table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={reviews.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Review"
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
                  label="Product ID"
                  field="product_id"
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
                  label="User ID"
                  field="user_id"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Rating"
                  field="rating"
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
              {reviews.length === 0 && !loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No reviews found matching "${searchTerm}"` 
                          : 'No reviews found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all reviews.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review, index) => (
                  <ReviewTableRow
                    key={review.id}
                    review={review}
                    index={(page - 1) * entriesPerPage + index + 1}
                    isSelected={selectedReviews.has(review.id)}
                    onToggle={toggle}
                    onEdit={() => setEditModal({ isOpen: true, review })}
                    onDelete={() => setDeleteModal({ isOpen: true, review })}
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

        {/* Edit modal */}
        <ReviewEditModal
          review={editModal.review}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, review: null })}
          onSave={handleUpdate}
        />

        {/* Delete modal */}
        <ConfirmDeleteModal
          entity={deleteModal.review}
          entityType="review"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, review: null })}
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

export default ReviewManagement
