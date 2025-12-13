/**
 * Product Management Page Component
 * Full CRUD operations for products with filters, search, pagination, bulk actions
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import SkeletonLoader from '../../components/SkeletonLoader'
import QuickActionButton from '../../components/admin/QuickActionButton'
import InlineEditCell from '../../components/admin/InlineEditCell'
import BulkSelectCheckbox from '../../components/admin/BulkSelectCheckbox'
import BulkActionBar from '../../components/admin/BulkActionBar'
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal'
import QuickCreateModal from '../../components/admin/QuickCreateModal'
import SearchFilterBar from '../../components/admin/SearchFilterBar'
import Pagination from '../../components/admin/Pagination'
import { useSelection } from '../../utils/useSelection'
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
 * @date 2025-12-12
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null })
  const [createModal, setCreateModal] = useState({ isOpen: false })
  const { selected: selectedProducts, toggle, selectAll, clear, selectedCount } = useSelection(products)

  /**
   * Fetch products
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page, limit: 20 })
      if (searchTerm) params.append('search', searchTerm)
      if (stockFilter) params.append('stock', stockFilter)
      const response = await axios.get(`/api/admin/products?${params}`)
      setProducts(response.data.products || [])
      setTotalPages(response.data.pagination?.pages || 1)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, searchTerm, stockFilter])

  /**
   * Handle product stock update
   * @param {number} productId - Product ID
   * @param {number} newStock - New stock level
   * @author Thang Truong
   * @date 2025-12-12
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
   * @date 2025-12-12
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
   * Handle create success
   * @param {Object} data - Product data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCreateSuccess = async (data) => {
    try {
      await quickCreateProduct(data)
      setCreateModal({ isOpen: false })
      fetchProducts()
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
   * @date 2025-12-12
   */
  /**
   * Handle bulk action
   * @param {string} actionType - Action type
   * @param {Object} data - Action data
   * @author Thang Truong
   * @date 2025-12-12
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  /* Product management page */
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <QuickActionButton type="product" onCreate={() => setCreateModal({ isOpen: true })} />
        </div>

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

        {/* Products table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <BulkSelectCheckbox
                      itemId={product.id}
                      isSelected={selectedProducts.has(product.id)}
                      onToggle={toggle}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-800">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineEditCell
                      value={product.price || 0}
                      type="number"
                      onSave={(newPrice) => handlePriceUpdate(product.id, newPrice)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <InlineEditCell
                      value={product.stock || 0}
                      type="number"
                      onSave={(newStock) => handleStockUpdate(product.id, newStock)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, product })}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete product"
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
          entity={deleteModal.product}
          entityType="product"
          isOpen={deleteModal.isOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ isOpen: false, product: null })}
        />

        <QuickCreateModal
          type="product"
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSuccess={handleCreateSuccess}
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
