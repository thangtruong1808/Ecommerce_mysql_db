/**
 * Video Management Page
 * Full CRUD operations for product videos with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaVideo } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import VideoEditModal from '../../components/admin/VideoEditModal'
import VideoTableRow from '../../components/admin/VideoTableRow'
import { useSelection } from '../../utils/useSelection'
import { deleteVideo, setPrimaryVideo, updateVideo } from '../../utils/mediaApi'

/**
 * VideoManagement component
 * @returns {JSX.Element} Video management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const VideoManagement = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, video: null })
  const [editModal, setEditModal] = useState({ isOpen: false, video: null })
  const [playingVideo, setPlayingVideo] = useState(null)
  const { selected: selectedVideos, toggle, selectAll, clear, selectedCount } = useSelection(videos)

  /**
   * Fetch videos with search and filters
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchVideos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', String(searchTerm))
      if (productFilter) params.append('productId', productFilter)
      const response = await axios.get(`/api/admin/videos?${params}`)
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: 20, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.videos) {
        setVideos(response.data.videos || [])
        setTotalPages(pagination.pages || 1)
      } else {
        setVideos([])
        setTotalPages(1)
      }
      setInitialLoad(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No videos found matching your search'
      toast.error(errorMessage)
      setVideos([])
      setTotalPages(1)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [page, searchTerm, productFilter])

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteVideo(deleteModal.video.id)
      setDeleteModal({ isOpen: false, video: null })
      fetchVideos()
    } catch (error) {
      // Error handled in API
    }
  }

  /**
   * Handle set primary
   * @param {number} videoId - Video ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSetPrimary = async (videoId) => {
    try {
      const video = videos.find(v => v.id === videoId)
      if (video) {
        await setPrimaryVideo(video.product_id, videoId)
        fetchVideos()
      }
    } catch (error) {
      // Error handled in API
    }
  }

  /**
   * Handle bulk delete
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedVideos)
      for (const id of ids) await deleteVideo(id)
      clear()
      fetchVideos()
    } catch (error) {
      // Error handled in API
    }
  }

  /**
   * Handle video update
   * @param {Object} data - Update data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleVideoUpdate = async (data) => {
    try {
      await updateVideo(editModal.video.id, data)
      setEditModal({ isOpen: false, video: null })
      fetchVideos()
    } catch (error) {
      // Error handled in API
    }
  }

  if (loading && initialLoad && videos.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Video management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaVideo className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Video Management</h1>
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
          filterValue={productFilter}
          onFilterChange={(value) => {
            setProductFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Products' }
          ]}
          searchPlaceholder="Search by product name, title, or video URL..."
        />

        {/* Videos table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={videos.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thumbnail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.length === 0 && !loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No videos found matching "${searchTerm}"` 
                          : 'No videos found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all videos.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <VideoTableRow
                  key={video.id}
                  video={video}
                  isSelected={selectedVideos.has(video.id)}
                  isPlaying={playingVideo === video.id}
                  onToggle={toggle}
                  onPlay={(id) => setPlayingVideo(id)}
                  onEdit={(v) => setEditModal({ isOpen: true, video: v })}
                  onSetPrimary={handleSetPrimary}
                  onDelete={(id) => setDeleteModal({ isOpen: true, video: videos.find(v => v.id === id) })}
                  />
                ))
              )}
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
          entity={deleteModal.video}
          entityType="video"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, video: null })}
        />

        {/* Edit modal */}
        <VideoEditModal
          video={editModal.video}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, video: null })}
          onSave={handleVideoUpdate}
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

export default VideoManagement

