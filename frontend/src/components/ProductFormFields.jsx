/**
 * Product Form Fields Component
 * Reusable product form input fields with category selection by name
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * ProductFormFields component
 * Displays category, subcategory, and child category selects by name (not ID)
 * @param {Object} props - Component props
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.errors - Form errors object
 * @param {Array} props.categories - Categories array
 * @param {Array} props.subcategories - Subcategories array
 * @param {Array} props.childCategories - Child categories array
 * @param {number} props.selectedCategory - Selected category ID
 * @param {number} props.selectedSubcategory - Selected subcategory ID
 * @returns {JSX.Element} Product form fields component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ProductFormFields = ({ register, errors, categories = [], subcategories = [], childCategories = [], selectedCategory, selectedSubcategory }) => {
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
    </>
  )
}

export default ProductFormFields

