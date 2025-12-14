/**
 * Review Management Page
 * Full CRUD operations for reviews with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaStar } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
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
 * @date 2025-12-12
 */
const ReviewManagement = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, review: null })
  const [editModal, setEditModal] = useState({ isOpen: false, review: null })
  const { selected: selectedReviews, toggle, selectAll, clear, selectedCount } = useSelection(reviews)

  /**
   * Fetch reviews
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      if (ratingFilter) params.append('rating', ratingFilter)
      const response = await axios.get(`/api/admin/reviews?${params}`)
      setReviews(response.data.reviews || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [page, searchTerm, ratingFilter])

  /**
   * Handle update review
   * @param {Object} data - Review data
   * @author Thang Truong
   * @date 2025-12-12
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
   * @date 2025-12-12
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
   * @date 2025-12-12
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


  if (loading && reviews.length === 0) {
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
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Review Management</h1>

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

        {/* Reviews table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <ReviewTableRow
                  key={review.id}
                  review={review}
                  isSelected={selectedReviews.has(review.id)}
                  onToggle={toggle}
                  onEdit={() => setEditModal({ isOpen: true, review })}
                  onDelete={() => setDeleteModal({ isOpen: true, review })}
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
