/**
 * Products Page Component
 * Displays product listing with filters, search, and pagination
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import SkeletonLoader from '../components/SkeletonLoader'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/Pagination'
import FilterSidebar from '../components/FilterSidebar'

/**
 * Products component
 * @returns {JSX.Element} Products listing page
 */
const Products = () => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const isUpdatingFromUrl = useRef(false)
  const categoriesCacheRef = useRef(null)
  const categoriesLoadingRef = useRef(false)
  const productsLoadingRef = useRef(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [childCategories, setChildCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    childCategory: searchParams.get('childCategory') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    page: parseInt(searchParams.get('page')) || 1,
  })

  /**
   * Fetch products with current filters
   */
  const fetchProducts = async () => {
    if (productsLoadingRef.current) return
    try {
      productsLoadingRef.current = true
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.subcategory) params.append('subcategory', filters.subcategory)
      if (filters.childCategory) params.append('childCategory', filters.childCategory)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      params.append('page', filters.page)

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data.products || [])
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(error.response?.data?.message || 'Failed to load products')
    } finally {
      setLoading(false)
      productsLoadingRef.current = false
    }
  }

  /**
   * Fetch categories with subcategories
   */
  const fetchCategories = async () => {
    if (categoriesCacheRef.current) {
      setCategories(categoriesCacheRef.current)
      return
    }
    if (categoriesLoadingRef.current) return
    categoriesLoadingRef.current = true
    try {
      const response = await axios.get('/api/products/categories')
      categoriesCacheRef.current = response.data
      setCategories(response.data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load categories')
    } finally {
      categoriesLoadingRef.current = false
    }
  }

  /**
   * Fetch subcategories when category changes
   */
  useEffect(() => {
    if (filters.category) {
      const selectedCategory = categories.find(cat => cat.id === parseInt(filters.category))
      if (selectedCategory?.subcategories) {
        setSubcategories(selectedCategory.subcategories)
      } else {
        const fetchSubcategories = async () => {
          try {
            const response = await axios.get(`/api/products/subcategories/${filters.category}`)
            setSubcategories(response.data)
          } catch (error) {
            console.error('Error fetching subcategories:', error)
            toast.error(error.response?.data?.message || 'Failed to load subcategories')
          }
        }
        fetchSubcategories()
      }
      setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      setChildCategories([])
    } else {
      setSubcategories([])
      setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      setChildCategories([])
    }
  }, [filters.category, categories])

  /**
   * Fetch child categories when subcategory changes
   */
  useEffect(() => {
    if (filters.subcategory) {
      const selectedSubcategory = subcategories.find(sub => sub.id === parseInt(filters.subcategory))
      if (selectedSubcategory?.child_categories) {
        setChildCategories(selectedSubcategory.child_categories)
      } else {
        const fetchChildCategories = async () => {
          try {
            const response = await axios.get(`/api/products/child-categories/${filters.subcategory}`)
            setChildCategories(response.data)
          } catch (error) {
            console.error('Error fetching child categories:', error)
            toast.error(error.response?.data?.message || 'Failed to load child categories')
          }
        }
        fetchChildCategories()
      }
    } else {
      setChildCategories([])
      setFilters(prev => ({ ...prev, childCategory: '' }))
    }
  }, [filters.subcategory, subcategories])

  /**
   * Handle childCategory from URL: hydrate parent subcategory/category and child list
   */
  useEffect(() => {
    const hydrateFromChildCategory = async () => {
      if (!filters.childCategory || !categories.length) return
      try {
        const childRes = await axios.get(`/api/products/child-category/${filters.childCategory}`)
        const childInfo = childRes.data
        if (!childInfo?.subcategory_id) return

        // Find parent category/subcategory in loaded categories
        let parentCat = null
        let parentSub = null
        for (const cat of categories) {
          const foundSub = (cat.subcategories || []).find(sub => sub.id === childInfo.subcategory_id)
          if (foundSub) {
            parentCat = cat
            parentSub = foundSub
            break
          }
        }

        // If found in cached categories, set filters and fetch children for that subcategory
        if (parentCat && parentSub) {
          setSubcategories(parentCat.subcategories || [])
          const childList = parentSub.child_categories || []
          if (childList.length > 0) {
            setChildCategories(childList)
          } else {
            const childListRes = await axios.get(`/api/products/child-categories/${parentSub.id}`)
            setChildCategories(childListRes.data)
          }
          setFilters(prev => ({
            ...prev,
            category: parentCat.id.toString(),
            subcategory: parentSub.id.toString(),
            childCategory: filters.childCategory
          }))
          return
        }

        // Fallback: fetch subcategory and categories if not found locally
        const subRes = await axios.get(`/api/products/subcategories/${childInfo.subcategory_id}`)
        const sub = Array.isArray(subRes.data) ? subRes.data[0] : subRes.data
        if (sub?.category_id) {
          if (!categoriesCacheRef.current) {
            const catRes = await axios.get('/api/products/categories')
            categoriesCacheRef.current = catRes.data
          }
          const catList = categoriesCacheRef.current || []
          const cat = catList.find(c => c.id === sub.category_id)
          if (cat) {
            setCategories(catList)
            setSubcategories(cat.subcategories || [])
            const childListRes = await axios.get(`/api/products/child-categories/${sub.id}`)
            setChildCategories(childListRes.data)
            setFilters(prev => ({
              ...prev,
              category: sub.category_id.toString(),
              subcategory: sub.id.toString(),
              childCategory: filters.childCategory
            }))
          }
        }
      } catch (error) {
        console.error('Error hydrating from child category:', error)
      }
    }

    hydrateFromChildCategory()
  }, [filters.childCategory, categories])

  /**
   * Sync filters from URL when URL changes (e.g., navigation from Navbar)
   */
  useEffect(() => {
    const urlCategory = searchParams.get('category') || ''
    const urlSubcategory = searchParams.get('subcategory') || ''
    const urlChildCategory = searchParams.get('childCategory') || ''
    const urlSearch = searchParams.get('search') || ''
    const urlMinPrice = searchParams.get('minPrice') || ''
    const urlMaxPrice = searchParams.get('maxPrice') || ''
    const urlSortBy = searchParams.get('sortBy') || 'created_at'
    const urlPage = parseInt(searchParams.get('page')) || 1

    setFilters({
      search: urlSearch,
      category: urlCategory,
      subcategory: urlSubcategory,
      childCategory: urlChildCategory,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      sortBy: urlSortBy,
      page: urlPage,
    })
    isUpdatingFromUrl.current = true
  }, [searchParams])

  /**
   * Update URL when filters change (skip if filters came from URL)
   */
  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false
      return
    }
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.subcategory) params.set('subcategory', filters.subcategory)
    if (filters.childCategory) params.set('childCategory', filters.childCategory)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.sortBy && filters.sortBy !== 'created_at') params.set('sortBy', filters.sortBy)
    if (filters.page > 1) params.set('page', filters.page.toString())
    const currentParams = searchParams.toString()
    const newParams = params.toString()
    if (currentParams !== newParams) {
      setSearchParams(params, { replace: true })
    }
  }, [filters, setSearchParams, searchParams])

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
   * Handle page change
   * @param {number} page - Page number
   */
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
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
        {/* Loading skeleton */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        <SkeletonLoader type="card" count={6} />
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
          <FilterSidebar
            categories={categories}
            subcategories={subcategories}
            childCategories={childCategories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Products grid */}
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {products.length > 0 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
