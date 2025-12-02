/**
 * Product Form Component
 * Form for creating and editing products (admin only)
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '../../components/admin/AdminLayout'
import ProtectedRoute from '../../components/ProtectedRoute'
import ProductFormFields from '../../components/ProductFormFields'
import Button from '../../components/Button'

/**
 * ProductForm component
 * @returns {JSX.Element} Product form page
 */
const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [childCategories, setChildCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm()

  const selectedCategory = watch('category_id')
  const selectedSubcategory = watch('subcategory_id')

  /**
   * Fetch categories
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/products/categories')
        setCategories(response.data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  /**
   * Fetch subcategories when category changes
   */
  useEffect(() => {
    if (selectedCategory) {
      const selectedCat = categories.find(cat => cat.id === parseInt(selectedCategory))
      if (selectedCat?.subcategories) {
        setSubcategories(selectedCat.subcategories)
      } else {
        const fetchSubcategories = async () => {
          try {
            const response = await axios.get(`/api/products/subcategories/${selectedCategory}`)
            setSubcategories(response.data)
          } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load subcategories')
          }
        }
        fetchSubcategories()
      }
      setValue('subcategory_id', '')
      setValue('child_category_id', '')
      setChildCategories([])
    } else {
      setSubcategories([])
      setChildCategories([])
    }
  }, [selectedCategory, categories, setValue])

  /**
   * Fetch child categories when subcategory changes
   */
  useEffect(() => {
    if (selectedSubcategory) {
      const selectedSub = subcategories.find(sub => sub.id === parseInt(selectedSubcategory))
      if (selectedSub?.child_categories) {
        setChildCategories(selectedSub.child_categories)
      } else {
        const fetchChildCategories = async () => {
          try {
            const response = await axios.get(`/api/products/child-categories/${selectedSubcategory}`)
            setChildCategories(response.data)
          } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load child categories')
          }
        }
        fetchChildCategories()
      }
      setValue('child_category_id', '')
    } else {
      setChildCategories([])
    }
  }, [selectedSubcategory, subcategories, setValue])

  /**
   * Fetch product data for editing
   */
  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/products/${id}`)
          const product = response.data
          setValue('name', product.name)
          setValue('description', product.description)
          setValue('price', product.price)
          setValue('stock', product.stock)
          setValue('category_id', product.category_id)
          setValue('subcategory_id', product.subcategory_id)
          setValue('child_category_id', product.child_category_id)
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to load product')
          navigate('/admin/products')
        }
      }
      fetchProduct()
    }
  }, [id, isEdit, setValue, navigate])

  /**
   * Handle form submission
   * @param {Object} data - Form data
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      if (isEdit) {
        await axios.put(`/api/products/${id}`, data)
        toast.success('Product updated successfully')
      } else {
        await axios.post('/api/products', data)
        toast.success('Product created successfully')
      }
      
      navigate('/admin/products')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Form header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isEdit ? 'Edit Product' : 'Create New Product'}
        </h1>

        {/* Product form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Form fields */}
          <ProductFormFields
            register={register}
            errors={errors}
            categories={categories}
            subcategories={subcategories}
            childCategories={childCategories}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
          />

          {/* Form actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => navigate('/admin/products')}
              variant="secondary"
              icon="cancel"
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
    </AdminLayout>
  )
}

export default ProductForm

