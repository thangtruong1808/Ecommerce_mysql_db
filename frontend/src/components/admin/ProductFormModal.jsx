/**
 * Product Form Modal Component
 * Modal for creating and editing products (admin only)
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
import ProductFormFields from '../ProductFormFields'
import Button from '../Button'

/**
 * ProductFormModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSuccess - Success callback
 * @param {Object} props.product - Product data for editing (optional)
 * @returns {JSX.Element} Product form modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ProductFormModal = ({ isOpen = false, onClose, onSuccess, product = null }) => {
  const isEdit = !!product
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [childCategories, setChildCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm()

  const selectedCategory = watch('category_id')
  const selectedSubcategory = watch('subcategory_id')

  /**
   * Reset form when modal closes
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (!isOpen) {
      reset()
      setSubcategories([])
      setChildCategories([])
    }
  }, [isOpen, reset])

  /**
   * Fetch categories (all data, no limit)
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await axios.get('/api/products/categories')
          setCategories(response.data || [])
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load categories')
        }
      }
      fetchCategories()
    }
  }, [isOpen])

  /**
   * Fetch subcategories when category changes (all data, no limit)
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (selectedCategory && isOpen) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get(`/api/products/subcategories/${selectedCategory}`)
          setSubcategories(response.data || [])
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load subcategories')
        }
      }
      fetchSubcategories()
      if (!isEdit) {
        setValue('subcategory_id', '')
        setValue('child_category_id', '')
        setChildCategories([])
      }
    } else if (!selectedCategory) {
      setSubcategories([])
      setChildCategories([])
    }
  }, [selectedCategory, isOpen, setValue, isEdit])

  /**
   * Fetch child categories when subcategory changes (all data, no limit)
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (selectedSubcategory && isOpen) {
      const fetchChildCategories = async () => {
        try {
          const response = await axios.get(`/api/products/child-categories/${selectedSubcategory}`)
          setChildCategories(response.data || [])
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load child categories')
        }
      }
      fetchChildCategories()
      if (!isEdit) {
        setValue('child_category_id', '')
      }
    } else if (!selectedSubcategory) {
      setChildCategories([])
    }
  }, [selectedSubcategory, isOpen, setValue, isEdit])

  /**
   * Load product data for editing
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (isEdit && product && categories.length > 0 && isOpen) {
      setValue('name', product.name)
      setValue('description', product.description)
      setValue('price', product.price)
      setValue('stock', product.stock)
      
      // Set category and fetch subcategories
      if (product.category_id) {
        setValue('category_id', product.category_id)
        const fetchSubcategories = async () => {
          try {
            const subRes = await axios.get(`/api/products/subcategories/${product.category_id}`)
            setSubcategories(subRes.data || [])
            
            // Set subcategory and fetch child categories
            if (product.subcategory_id) {
              setValue('subcategory_id', product.subcategory_id)
              const fetchChildCategories = async () => {
                try {
                  const childRes = await axios.get(`/api/products/child-categories/${product.subcategory_id}`)
                  setChildCategories(childRes.data || [])
                  setValue('child_category_id', product.child_category_id)
                } catch (error) {
                  toast.error(error.response?.data?.message || 'Failed to load child categories')
                }
              }
              fetchChildCategories()
            }
          } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load subcategories')
          }
        }
        fetchSubcategories()
      }
    }
  }, [isEdit, product, categories, setValue, isOpen])

  /**
   * Handle form submission
   * @param {Object} data - Form data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      if (isEdit) {
        await axios.put(`/api/products/${product.id}`, data)
        toast.success('Product updated successfully')
      } else {
        await axios.post('/api/products', data)
        toast.success('Product created successfully')
      }
      
      if (onSuccess) onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  /* Product form modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Form fields with category selection by name */}
          <ProductFormFields
            register={register}
            errors={errors}
            categories={categories}
            subcategories={subcategories}
            childCategories={childCategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
          />

          {/* Modal footer */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              icon="cancel"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              icon="save"
            >
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
