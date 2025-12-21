/**
 * Products Data Hook
 * Custom hook for managing products data, filters, categories, and pagination
 * Handles URL synchronization, category hierarchy (category -> subcategory -> child category)
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { loadCategories } from '../utils/categoryCache'

const PAGE_SIZE = 15

/**
 * Initialize filters from URL search params
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Initial filter state
 * @author Thang Truong
 * @date 2025-12-17
 */
const initialFilters = (searchParams) => ({
  search: searchParams.get('search') || '',
  category: searchParams.get('category') || '',
  subcategory: searchParams.get('subcategory') || '',
  childCategory: searchParams.get('childCategory') || '',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
  sortBy: searchParams.get('sortBy') || 'created_at',
  sortOrder: (searchParams.get('sortOrder') || 'DESC').toUpperCase(),
  page: parseInt(searchParams.get('page')) || 1,
})

/**
 * useProductsData hook
 * Main hook for products page data management
 * @param {URLSearchParams} searchParams - Current URL search parameters
 * @param {Function} setSearchParams - Function to update URL search parameters
 * @returns {Object} Products data, filters, handlers, and loading state
 * @author Thang Truong
 * @date 2025-12-17
 */
export const useProductsData = (searchParams, setSearchParams) => {
  const [filters, setFilters] = useState(initialFilters(searchParams))
  const [isFilterOpen, setIsFilterOpen] = useState(Boolean(searchParams.get('openFilters')))
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [childCategories, setChildCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(initialFilters(searchParams).search)
  const searchDebounceRef = useRef(null)

  const isUpdatingFromUrl = useRef(false)
  const productsLoadingRef = useRef(false)
  const categoriesCacheRef = useRef(null)
  const isHydratingSubcategoryRef = useRef(false)

  /**
   * Fetch products with current filters
   * @returns {Promise<void>} Resolves when products fetched
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchProducts = async () => {
    if (productsLoadingRef.current) return
    productsLoadingRef.current = true
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.subcategory) params.append('subcategory', filters.subcategory)
      if (filters.childCategory) params.append('childCategory', filters.childCategory)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
      params.append('page', filters.page)
      params.append('limit', PAGE_SIZE)

      const response = await axios.get(`/api/products?${params}`)
      setProducts(response.data.products || [])
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 })
    } catch (error) {
      if (error?.response?.status === 429) {
        toast.error('Please retry in a moment (rate limited).')
      } else {
        toast.error(error.response?.data?.message || 'Failed to load products')
      }
    } finally {
      setLoading(false)
      productsLoadingRef.current = false
    }
  }

  /**
   * Fetch categories with nested subcategories and child categories
   * Uses cached categories when available
   * @returns {Promise<void>} Resolves when categories fetched
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchCategories = async () => {
    try {
      const data = await loadCategories()
      setCategories(data || [])
    } catch (error) {
      if (error?.response?.status !== 429) {
        toast.error(error.response?.data?.message || 'Failed to load categories')
      }
    }
  }

  /**
   * Handle subcategory-only URL params (find parent category)
   * Ensures breadcrumb and filters work when navigating from mega menu
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    if (!filters.category && filters.subcategory && categories.length > 0 && !isHydratingSubcategoryRef.current) {
      const subcategoryId = parseInt(filters.subcategory)
      for (const category of categories) {
        const subcategory = (category.subcategories || []).find(sub => sub.id === subcategoryId)
        if (subcategory) {
          isHydratingSubcategoryRef.current = true
          setSubcategories(category.subcategories || [])
          setFilters(prev => ({
            ...prev,
            category: category.id.toString(),
            subcategory: filters.subcategory
          }))
          setTimeout(() => { isHydratingSubcategoryRef.current = false }, 100)
          return
        }
      }
      // If not found in loaded categories, try to fetch subcategory info
      const hydrateSubcategory = async () => {
        if (isHydratingSubcategoryRef.current) return
        isHydratingSubcategoryRef.current = true
        try {
          const allCategories = await loadCategories()
          for (const cat of allCategories) {
            const sub = (cat.subcategories || []).find(s => s.id === subcategoryId)
            if (sub) {
              setCategories(allCategories)
              setSubcategories(cat.subcategories || [])
              setFilters(prev => ({
                ...prev,
                category: cat.id.toString(),
                subcategory: filters.subcategory
              }))
              isHydratingSubcategoryRef.current = false
              return
            }
          }
          isHydratingSubcategoryRef.current = false
        } catch (error) {
          isHydratingSubcategoryRef.current = false
          // Silent fail - will fall through to clearing subcategory
        }
      }
      hydrateSubcategory()
      return
    }
    
    if (!filters.category) {
      setSubcategories([])
      setChildCategories([])
      setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      return
    }
    
    /**
     * Handle category change - load subcategories
     * If subcategory is in URL, preserve it and its child categories
     * @author Thang Truong
     * @date 2025-12-17
     */
    const selected = categories.find(cat => cat.id === parseInt(filters.category))
    if (selected?.subcategories) {
      setSubcategories(selected.subcategories)
      
      // If subcategory is in URL, try to preserve its child categories
      if (filters.subcategory) {
        const selectedSub = selected.subcategories.find(sub => sub.id === parseInt(filters.subcategory))
        if (selectedSub?.child_categories && Array.isArray(selectedSub.child_categories)) {
          setChildCategories(selectedSub.child_categories)
        } else {
          setChildCategories([])
        }
      } else {
      setChildCategories([])
      }
      
      // Don't clear subcategory if it matches the selected category's subcategories
      const subcategoryExists = selected.subcategories.some(sub => sub.id === parseInt(filters.subcategory))
      if (!subcategoryExists && filters.subcategory) {
        setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      }
      return
    }
    
    /**
     * Fetch subcategories from API if not in nested structure
     * @author Thang Truong
     * @date 2025-12-17
     */
    const fetchSubs = async () => {
      try {
        const response = await axios.get(`/api/products/subcategories/${filters.category}`)
        setSubcategories(response.data || [])
        
        // Clear child categories - they will be fetched by the child category useEffect
        setChildCategories([])
        
        // Don't clear subcategory if it exists in the fetched subcategories
        const subcategoryExists = (response.data || []).some(sub => sub.id === parseInt(filters.subcategory))
        if (!subcategoryExists && filters.subcategory) {
          setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
        }
      } catch (error) {
        if (error?.response?.status !== 429) {
        toast.error(error.response?.data?.message || 'Failed to load subcategories')
        }
      }
    }
    fetchSubs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.subcategory, categories])

  /**
   * Fetch child categories when subcategory changes
   * Handles both nested child_categories and API fetch
   * Always fetches from API if subcategory filter exists, even if subcategories array is empty
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    if (!filters.subcategory) {
      setChildCategories([])
      setFilters(prev => ({ ...prev, childCategory: '' }))
      return
    }
    
    // Check if subcategory exists in current subcategories list and has nested child_categories
    const selected = subcategories.find(sub => sub.id === parseInt(filters.subcategory))
    
    // If subcategory found and has nested child_categories, use them
    if (selected?.child_categories && Array.isArray(selected.child_categories) && selected.child_categories.length > 0) {
      setChildCategories(selected.child_categories)
      return
    }
    
    // Always fetch child categories from API when subcategory filter exists
    // This ensures child categories are loaded even when subcategories array is not yet populated
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`/api/products/child-categories/${filters.subcategory}`)
        setChildCategories(response.data || [])
      } catch (error) {
        // Only show error if it's not a 429 (rate limit)
        if (error?.response?.status !== 429) {
        toast.error(error.response?.data?.message || 'Failed to load child categories')
        }
        setChildCategories([])
      }
    }
    
    // Always fetch when subcategory filter exists
    fetchChildren()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.subcategory, subcategories])

  /**
   * Hydrate category/subcategory when only childCategory is in URL
   * Fetches parent hierarchy to populate filters correctly
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const hydrate = async () => {
      if (!filters.childCategory || !categories.length) return
      try {
        const childRes = await axios.get(`/api/products/child-category/${filters.childCategory}`)
        const childInfo = childRes.data
        if (!childInfo?.subcategory_id) return

        // Try to find parent in loaded categories
        const parentCat = categories.find(cat =>
          (cat.subcategories || []).some(sub => sub.id === childInfo.subcategory_id)
        )
        const parentSub = parentCat?.subcategories?.find(sub => sub.id === childInfo.subcategory_id)

        if (parentCat && parentSub) {
          setSubcategories(parentCat.subcategories || [])
          const childList = parentSub.child_categories || []
          if (childList.length > 0) {
            setChildCategories(childList)
          } else {
            const childListRes = await axios.get(`/api/products/child-categories/${parentSub.id}`)
            setChildCategories(childListRes.data || [])
          }
          setFilters(prev => ({
            ...prev,
            category: parentCat.id.toString(),
            subcategory: parentSub.id.toString(),
            childCategory: filters.childCategory
          }))
          return
        }

        // If not found, fetch subcategory and category
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
            setChildCategories(childListRes.data || [])
            setFilters(prev => ({
              ...prev,
              category: sub.category_id.toString(),
              subcategory: sub.id.toString(),
              childCategory: filters.childCategory
            }))
          }
        }
      } catch (error) {
        if (error?.response?.status !== 429) {
        toast.error(error.response?.data?.message || 'Failed to load child category')
        }
      }
    }
    hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.childCategory, categories])

  /**
   * Sync filters from URL params when URL changes
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const nextFilters = initialFilters(searchParams)
    setFilters(nextFilters)
    setSearchInput(nextFilters.search)
    setIsFilterOpen(Boolean(searchParams.get('openFilters')))
    isUpdatingFromUrl.current = true
  }, [searchParams])

  /**
   * Sync URL params when filters change (bidirectional sync)
   * @author Thang Truong
   * @date 2025-12-17
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
    if (filters.sortOrder && filters.sortOrder !== 'DESC') params.set('sortOrder', filters.sortOrder)
    if (filters.page > 1) params.set('page', filters.page.toString())
    if (isFilterOpen) params.set('openFilters', '1')
    const currentParams = searchParams.toString()
    const newParams = params.toString()
    if (currentParams !== newParams) setSearchParams(params, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, setSearchParams, searchParams, isFilterOpen])

  /**
   * Fetch categories on mount
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => { fetchCategories() }, [])

  /**
   * Fetch products when filters change
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => { fetchProducts() }, [filters])

  /**
   * Setup global event listeners for filter drawer
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const openHandler = () => setIsFilterOpen(true)
    const toggleHandler = () => setIsFilterOpen(prev => !prev)
    window.addEventListener('open-filters', openHandler)
    window.addEventListener('toggle-filters', toggleHandler)
    return () => {
      window.removeEventListener('open-filters', openHandler)
      window.removeEventListener('toggle-filters', toggleHandler)
    }
  }, [])

  /**
   * Handle filter change event
   * @param {string} key - Filter key
   * @param {string|number} value - Filter value
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleFilterChange = (key, value) => {
    if (key === 'sort') {
      const [field, order] = value.split('|')
      setFilters(prev => ({ ...prev, sortBy: field, sortOrder: order?.toUpperCase() || 'DESC', page: 1 }))
      return
    }
    if (key === 'search') {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
      setSearchInput(value)
      searchDebounceRef.current = setTimeout(() => {
        setFilters(prev => ({ ...prev, search: value, page: 1 }))
      }, 500)
      return
    }
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  /**
   * Handle page change event
   * @param {number} page - Page number
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page }))

  /**
   * Clear all filters and reset to defaults
   * @author Thang Truong
   * @date 2025-12-17
   */
  const clearFilters = () => {
    setSearchInput('')
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      childCategory: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'DESC',
      page: 1
    })
  }

  return {
    filters,
    searchInput,
    products,
    pagination,
    categories,
    subcategories,
    childCategories,
    loading,
    handleFilterChange,
    handlePageChange,
    clearFilters,
    isFilterOpen,
    openFilter: () => setIsFilterOpen(true),
    closeFilter: () => setIsFilterOpen(false),
  }
}

