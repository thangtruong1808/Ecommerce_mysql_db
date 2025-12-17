/**
 * Product Management Page Component
 * Full CRUD operations for products with filters, search, pagination, bulk actions
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaImages, FaBox } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import QuickActionButton from '../../components/admin/QuickActionButton'
import InlineEditCell from '../../components/admin/InlineEditCell'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import ProductFormModal from '../../components/admin/ProductFormModal'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import SortableTableHeader from '../../components/admin/SortableTableHeader'
import { useSelection } from '../../utils/useSelection'
import { formatDate } from '../../utils/dateUtils'
import {
  quickCreateProduct,
  updateProductStock,
  updateProductPrice,
  bulkUpdateProducts,
  deleteProduct,
} from '../../utils/dashboardCrud'

/**
 * ProductManagement component
 * @returns {JSX.Element} Product management page
 * @author Thang Truong
 * @date 2025-12-17
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [page, setPage] = useState(1)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null })
  const [formModal, setFormModal] = useState({ isOpen: false, product: null })
  const { selected: selectedProducts, toggle, selectAll, clear, selectedCount } = useSelection(products)

  /**
   * Fetch products
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ 
        page, 
        limit: entriesPerPage,
        sortBy,
        sortOrder
      })
      if (searchTerm) params.append('search', searchTerm)
      if (stockFilter) params.append('stock', stockFilter)
      const response = await axios.get(`/api/admin/products?${params}`)
      if (response.data && response.data.products) {
        setProducts(response.data.products || [])
        setTotalPages(response.data.pagination?.pages || 1)
        setTotalItems(response.data.pagination?.total || 0)
      } else {
        setProducts([])
        setTotalPages(1)
        setTotalItems(0)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load products')
      setProducts([])
      setTotalPages(1)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, entriesPerPage, searchTerm, stockFilter, sortBy, sortOrder])

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
   * Handle product stock update
   * @param {number} productId - Product ID
   * @param {number} newStock - New stock level
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleStockUpdate = async (productId, newStock) => {
    try {
      await updateProductStock(productId, newStock)
      fetchProducts()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle product price update
   * @param {number} productId - Product ID
   * @param {number} newPrice - New price
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handlePriceUpdate = async (productId, newPrice) => {
    try {
      await updateProductPrice(productId, newPrice)
      fetchProducts()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle form success (create or edit)
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleFormSuccess = () => {
    setFormModal({ isOpen: false, product: null })
    fetchProducts()
  }

  /**
   * Handle delete confirm
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteModal.product.id)
      setDeleteModal({ isOpen: false, product: null })
      fetchProducts()
    } catch (error) {
      // Error handled in utility
    }
  }

  /**
   * Handle bulk action
   * @param {string} actionType - Action type
   * @param {Object} data - Action data
   * @author Thang Truong
   * @date 2025-12-17
   */
  /**
   * Handle bulk action
   * @param {string} actionType - Action type
   * @param {Object} data - Action data
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleBulkAction = async (actionType, data) => {
    try {
      const ids = Array.from(selectedProducts)
      if (actionType === 'delete') {
        for (const id of ids) await deleteProduct(id)
      } else if (actionType === 'update-stock') {
        await bulkUpdateProducts(ids, { stock: data.stock })
      }
      clear()
      fetchProducts()
    } catch (error) {
      // Error handled in utility
    }
  }

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Product management page */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2 ">
          {/* Icon + Title */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
            <FaBox className="text-blue-600 text-2xl sm:mr-2 md:mr-2" />
            <h1 className="text-3xl font-bold text-gray-900 text-center mt-2 sm:mt-0">Product Management</h1>
          </div>        
          {/* Button */}
          <div className="flex items-center justify-center sm:mt-4 md:mt-0"> 
          <QuickActionButton type="product" onCreate={() => setFormModal({ isOpen: true, product: null })} />
          </div>
        </div>

         {/* Divider between header and key metrics */}
       <div className="my-2 mb-4"><hr /></div>
      
        {/* Filters and search */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setPage(1)
          }}
          filterValue={stockFilter}
          onFilterChange={(value) => {
            setStockFilter(value)
            setPage(1)
          }}
          filterOptions={[
            { value: '', label: 'All Stock' },
            { value: 'in_stock', label: 'In Stock' },
            { value: 'low_stock', label: 'Low Stock' },
            { value: 'out_of_stock', label: 'Out of Stock' }
          ]}
          searchPlaceholder="Search products..."
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

        {/* Products table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <BulkSelectCheckbox
                    isSelectAll
                    totalItems={products.length}
                    selectedCount={selectedCount}
                    onSelectAll={selectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <SortableTableHeader
                  label="ID Product"
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
                  label="Description"
                  field="description"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Price"
                  field="price"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Child Category"
                  field="child_category_name"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Stock"
                  field="stock"
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
                  label="Reviews"
                  field="num_reviews"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Discount Type"
                  field="discount_type"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Discount Value"
                  field="discount_value"
                  currentSort={sortBy}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHeader
                  label="Clearance"
                  field="is_on_clearance"
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
              {products.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <BulkSelectCheckbox
                      itemId={product.id}
                      isSelected={selectedProducts.has(product.id)}
                      onToggle={toggle}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(page - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => setFormModal({ isOpen: true, product })}
                      className="text-blue-600 hover:text-blue-800 text-left"
                      aria-label="Edit product"
                    >
                      {product.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={product.description}>
                    {product.description || <span className="text-gray-400">No description</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineEditCell
                      value={product.price || 0}
                      type="number"
                      onSave={(newPrice) => handlePriceUpdate(product.id, newPrice)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.child_category_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineEditCell
                      value={product.stock || 0}
                      type="number"
                      onSave={(newStock) => handleStockUpdate(product.id, newStock)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.rating ? product.rating.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.num_reviews || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.discount_type || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.discount_value || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.is_on_clearance ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/${product.id}/media`}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        aria-label="Manage media"
                      >
                        <FaImages className="w-3 h-3" />
                        Media
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, product })}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        aria-label="Delete product"
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
        <ConfirmDeleteModal
          entity={deleteModal.product}
          entityType="product"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, product: null })}
        />

        <ProductFormModal
          isOpen={formModal.isOpen}
          onClose={() => setFormModal({ isOpen: false, product: null })}
          onSuccess={handleFormSuccess}
          product={formModal.product}
        />

        {/* Bulk action bar */}
        {selectedCount > 0 && (
          <BulkActionBar
            selectedCount={selectedCount}
            actions={[
              { type: 'delete', label: 'Delete Selected' },
              { type: 'update-stock', label: 'Update Stock', data: { stock: 0 } },
            ]}
            onAction={handleBulkAction}
            onCancel={clear}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default ProductManagement
