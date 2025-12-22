/**
 * Product Form Fields Component
 * Reusable product form input fields with category selection by name
 * 
 * @author Thang Truong
 * @date 2025-01-28
 */

/**
 * ProductFormFields component
 * Displays category, subcategory, and child category selects by name (not ID)
 * @param {Object} props - Component props
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.errors - Form errors object
 * @param {Function} props.watch - React Hook Form watch function
 * @param {Array} props.categories - Categories array
 * @param {Array} props.subcategories - Subcategories array
 * @param {Array} props.childCategories - Child categories array
 * @param {number} props.selectedCategory - Selected category ID
 * @param {number} props.selectedSubcategory - Selected subcategory ID
 * @returns {JSX.Element} Product form fields component
 * @author Thang Truong
 * @date 2025-01-28
 */
const ProductFormFields = ({ register, errors, watch, categories = [], subcategories = [], childCategories = [], selectedCategory, selectedSubcategory }) => {
  /* Product form fields with category selection by name */
  return (
    <>
      {/* Form fields container */}
      {/* Product name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          {...register('name', { required: 'Product name is required' })}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Product description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Category selection */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          {...register('category_id', { required: 'Category is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">{errors.category_id.message}</p>
        )}
      </div>

      {/* Subcategory selection */}
      <div>
        <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700 mb-2">
          Subcategory *
        </label>
        <select
          {...register('subcategory_id', { 
            validate: (value) => {
              if (selectedCategory && !value) {
                return 'Subcategory is required'
              }
              return true
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{selectedCategory ? 'Select Subcategory' : 'Select Category First'}</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        {errors.subcategory_id && (
          <p className="mt-1 text-sm text-red-600">{errors.subcategory_id.message}</p>
        )}
      </div>

      {/* Child category selection */}
      <div>
        <label htmlFor="child_category_id" className="block text-sm font-medium text-gray-700 mb-2">
          Child Category *
        </label>
        <select
          {...register('child_category_id', { 
            validate: (value) => {
              if (selectedSubcategory && !value) {
                return 'Child category is required'
              }
              return true
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{selectedSubcategory ? 'Select Child Category' : 'Select Subcategory First'}</option>
          {childCategories.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
        {errors.child_category_id && (
          <p className="mt-1 text-sm text-red-600">{errors.child_category_id.message}</p>
        )}
      </div>

      {/* Price and stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            {...register('price', { 
              required: 'Price is required',
              min: { value: 0, message: 'Price must be positive' }
            })}
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
            Stock *
          </label>
          <input
            {...register('stock', { 
              required: 'Stock is required',
              min: { value: 0, message: 'Stock must be non-negative' }
            })}
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Discount section */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Discount (Optional)</h4>
        
        {/* Discount type */}
        <div className="mb-4">
          <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Type
          </label>
          <select
            {...register('discount_type', {
              validate: (value) => {
                const discountValue = watch('discount_value')
                if (value && !discountValue) {
                  return 'Discount value is required when discount type is selected'
                }
                return true
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          {errors.discount_type && (
            <p className="mt-1 text-sm text-red-600">{errors.discount_type.message}</p>
          )}
        </div>

        {/* Discount value */}
        <div className="mb-4">
          <label htmlFor="discount_value" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Value
          </label>
          <input
            {...register('discount_value', {
              validate: (value) => {
                const discountType = watch('discount_type')
                const price = parseFloat(watch('price')) || 0
                
                if (discountType && !value) {
                  return 'Discount value is required when discount type is selected'
                }
                if (value && !discountType) {
                  return 'Discount type is required when discount value is provided'
                }
                if (value) {
                  const numValue = parseFloat(value)
                  if (discountType === 'percentage') {
                    if (numValue <= 0 || numValue > 100) {
                      return 'Percentage must be between 0 and 100'
                    }
                  } else if (discountType === 'fixed') {
                    if (numValue <= 0) {
                      return 'Fixed discount must be positive'
                    }
                    if (price > 0 && numValue >= price) {
                      return 'Fixed discount must be less than product price'
                    }
                  }
                }
                return true
              }
            })}
            type="number"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.discount_value && (
            <p className="mt-1 text-sm text-red-600">{errors.discount_value.message}</p>
          )}
        </div>

        {/* Discount dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="discount_start_date" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              {...register('discount_start_date', {
                validate: (value) => {
                  const discountType = watch('discount_type')
                  const endDate = watch('discount_end_date')
                  if (discountType && !value) {
                    return 'Start date is required when discount is set'
                  }
                  if (value && endDate && new Date(value) >= new Date(endDate)) {
                    return 'Start date must be before end date'
                  }
                  return true
                }
              })}
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.discount_start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.discount_start_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="discount_end_date" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              {...register('discount_end_date', {
                validate: (value) => {
                  const discountType = watch('discount_type')
                  const startDate = watch('discount_start_date')
                  if (discountType && !value) {
                    return 'End date is required when discount is set'
                  }
                  if (value && startDate && new Date(value) <= new Date(startDate)) {
                    return 'End date must be after start date'
                  }
                  return true
                }
              })}
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.discount_end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.discount_end_date.message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductFormFields

