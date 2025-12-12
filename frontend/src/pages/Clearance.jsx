/**
 * Clearance Page Component
 * Displays all clearance products with active discounts
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import SkeletonLoader from '../components/SkeletonLoader'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import { FaTag } from 'react-icons/fa'

/**
 * Clearance component
 * @returns {JSX.Element} Clearance page
 * @author Thang Truong
 * @date 2025-12-12
 */
const Clearance = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({
    sortBy: 'created_at',
    sortOrder: 'DESC',
    page: 1,
  })

  /**
   * Fetch clearance products with current filters
   * @returns {Promise<void>} Resolves when products fetched
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchClearanceProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
      params.append('page', filters.page)
      params.append('limit', 15)

      const response = await axios.get(`/api/products/clearance?${params}`)
      setProducts(response.data.products || [])
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0, limit: 15 })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load clearance products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClearanceProducts()
  }, [filters])

  /**
   * Handle page change
   * @param {number} page - Page number
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
  }

  /**
   * Handle sort change
   * @param {string} sortBy - Sort field
   * @param {string} sortOrder - Sort order
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSortChange = (sortBy, sortOrder) => {
    setFilters({ ...filters, sortBy, sortOrder, page: 1 })
  }

  return (
    /* Clearance page layout */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <FaTag className="text-red-500 text-2xl" />
          <h1 className="text-3xl font-bold text-gray-900">Clearance Sale</h1>
        </div>
        <p className="text-gray-600">
          Shop our clearance items with amazing discounts!
        </p>
      </div>

      {/* Sort options */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={`${filters.sortBy}_${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('_')
              handleSortChange(sortBy, sortOrder)
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at_DESC">Newest First</option>
            <option value="created_at_ASC">Oldest First</option>
            <option value="price_ASC">Price: Low to High</option>
            <option value="price_DESC">Price: High to Low</option>
            <option value="name_ASC">Name: A to Z</option>
            <option value="name_DESC">Name: Z to A</option>
          </select>
        </div>
        <p className="text-sm text-gray-600">
          {pagination.total} {pagination.total === 1 ? 'item' : 'items'} on clearance
        </p>
      </div>

      {/* Products grid */}
      {loading ? (
        <SkeletonLoader type="card" count={12} />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          {/* No products message */}
          <p className="text-gray-600 text-lg">No clearance products available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {products.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              limit={pagination.limit || 15}
              total={pagination.total || 0}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Clearance

