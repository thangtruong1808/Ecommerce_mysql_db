/**
 * Products Page Component
 * Displays product listing with filters, search, and pagination
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

/**
 * Products component
 * @returns {JSX.Element} Products listing page
 */
const Products = () => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at',
    page: 1,
  })

  /**
   * Fetch products with current filters
   */
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.subcategory) params.append('subcategory', filters.subcategory)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      params.append('page', filters.page)

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch categories with subcategories
   */
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/products/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  /**
   * Fetch subcategories when category changes
   */
  useEffect(() => {
    if (filters.category) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`/api/products/subcategories/${filters.category}`)
          setSubcategories(response.data)
        } catch (error) {
          console.error('Error fetching subcategories:', error)
        }
      }
      fetchSubcategories()
    } else {
      setSubcategories([])
      setFilters(prev => ({ ...prev, subcategory: '' }))
    }
  }, [filters.category])

  /**
   * Load data on mount and filter changes
   */
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters])

  /**
   * Handle filter change
   * @param {string} key - Filter key
   * @param {string} value - Filter value
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  /**
   * Handle add to cart
   * @param {number} productId - Product ID
   */
  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    const result = await addToCart(productId, 1)
    if (result.success) {
      toast.success('Item added to cart!')
    } else {
      toast.error(result.error || 'Failed to add item')
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading state */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search products..."
              />
            </div>

            {/* Category filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory filter */}
            {filters.category && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="created_at">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="price DESC">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating DESC">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  {/* Product image */}
                  <Link to={`/products/${product.id}`}>
                    <div className="h-48 bg-gray-200"></div>
                  </Link>
                  
                  {/* Product info */}
                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{product.category_name} / {product.subcategory_name}</p>
                    <p className="text-xl font-semibold text-blue-600 mb-2">${product.price}</p>
                    {product.rating > 0 && (
                      <p className="text-sm text-gray-500 mb-2">★ {product.rating.toFixed(1)} ({product.num_reviews})</p>
                    )}
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
