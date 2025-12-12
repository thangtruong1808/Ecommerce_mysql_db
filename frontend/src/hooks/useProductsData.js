import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { loadCategories } from '../utils/categoryCache'

const PAGE_SIZE = 15

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

  useEffect(() => {
    if (!filters.category) {
      setSubcategories([])
      setChildCategories([])
      setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      return
    }
    const selected = categories.find(cat => cat.id === parseInt(filters.category))
    if (selected?.subcategories) {
      setSubcategories(selected.subcategories)
      setChildCategories([])
      setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      return
    }
    const fetchSubs = async () => {
      try {
        const response = await axios.get(`/api/products/subcategories/${filters.category}`)
        setSubcategories(response.data)
        setChildCategories([])
        setFilters(prev => ({ ...prev, subcategory: '', childCategory: '' }))
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load subcategories')
      }
    }
    fetchSubs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, categories])

  useEffect(() => {
    if (!filters.subcategory) {
      setChildCategories([])
      setFilters(prev => ({ ...prev, childCategory: '' }))
      return
    }
    const selected = subcategories.find(sub => sub.id === parseInt(filters.subcategory))
    if (selected?.child_categories) {
      setChildCategories(selected.child_categories)
      return
    }
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`/api/products/child-categories/${filters.subcategory}`)
        setChildCategories(response.data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load child categories')
      }
    }
    fetchChildren()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.subcategory, subcategories])

  useEffect(() => {
    const hydrate = async () => {
      if (!filters.childCategory || !categories.length) return
      try {
        const childRes = await axios.get(`/api/products/child-category/${filters.childCategory}`)
        const childInfo = childRes.data
        if (!childInfo?.subcategory_id) return

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
        toast.error(error.response?.data?.message || 'Failed to load child category')
      }
    }
    hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.childCategory, categories])

  useEffect(() => {
    const nextFilters = initialFilters(searchParams)
    setFilters(nextFilters)
    setSearchInput(nextFilters.search)
    setIsFilterOpen(Boolean(searchParams.get('openFilters')))
    isUpdatingFromUrl.current = true
  }, [searchParams])

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

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { fetchProducts() }, [filters])

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

  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page }))
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

