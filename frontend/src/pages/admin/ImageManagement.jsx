/**
 * Image Management Page
 * Full CRUD operations for product images with filters, search, pagination
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaImage } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import ImageLightbox from '../../components/admin/ImageLightbox'
import ImageTableRow from '../../components/admin/ImageTableRow'
import { useSelection } from '../../utils/useSelection'
import { deleteImage, setPrimaryImage } from '../../utils/mediaApi'

/**
 * ImageManagement component
 * @returns {JSX.Element} Image management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const ImageManagement = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, image: null })
  const [lightboxImage, setLightboxImage] = useState(null)
  const { selected: selectedImages, toggle, selectAll, clear, selectedCount } = useSelection(images)

  /**
   * Fetch images with search and filters
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchImages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', String(searchTerm))
      if (productFilter) params.append('productId', productFilter)
      const response = await axios.get(`/api/admin/images?${params}`)
      const pagination = response.data?.pagination || { 
        page: 1, 
        limit: 20, 
        total: 0, 
        pages: 1 
      }
      if (response.data && response.data.images) {
        setImages(response.data.images || [])
        setTotalPages(pagination.pages || 1)
      } else {
        setImages([])
        setTotalPages(1)
      }
      setInitialLoad(false)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'No images found matching your search'
      toast.error(errorMessage)
      setImages([])
      setTotalPages(1)
      setInitialLoad(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [page, searchTerm, productFilter])

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteImage(deleteModal.image.id)
      setDeleteModal({ isOpen: false, image: null })
      fetchImages()
    } catch (error) {
      // Error handled in API
    }
  }

  /**
   * Handle set primary
   * @param {number} imageId - Image ID
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSetPrimary = async (imageId) => {
    try {
      const image = images.find(img => img.id === imageId)
      if (image) {
        await setPrimaryImage(image.product_id, imageId)
        fetchImages()
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
      const ids = Array.from(selectedImages)
      for (const id of ids) {
        await deleteImage(id)
      }
      clear()
      fetchImages()
    } catch (error) {
      // Error handled in API
    }
  }


  if (loading && initialLoad && images.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Image management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaImage className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Image Management</h1>
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
          searchPlaceholder="Search by product name or image URL..."
        />

        {/* Images table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={images.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {images.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 text-lg font-medium">
                        {searchTerm 
                          ? `No images found matching "${searchTerm}"` 
                          : 'No images found'}
                      </p>
                      {searchTerm && (
                        <p className="text-gray-400 text-sm mt-2">
                          Try adjusting your search terms or clear the search to see all images.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                images.map((image) => (
                  <ImageTableRow
                  key={image.id}
                  image={image}
                  isSelected={selectedImages.has(image.id)}
                  onToggle={toggle}
                  onView={() => setLightboxImage(image)}
                  onSetPrimary={handleSetPrimary}
                  onDelete={(id) => setDeleteModal({ isOpen: true, image: images.find(img => img.id === id) })}
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
          entity={deleteModal.image}
          entityType="image"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, image: null })}
        />

        {/* Lightbox */}
        <ImageLightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[
              { type: 'delete', label: 'Delete Selected' }
            ]}
            onAction={(actionType) => {
              if (actionType === 'delete') {
                handleBulkDelete()
              }
            }}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default ImageManagement
