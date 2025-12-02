/**
 * Filter Sidebar Component
 * Displays product filters (search, category, price, sort)
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * FilterSidebar component
 * @param {Object} props - Component props
 * @param {Array} props.categories - Categories array with nested subcategories and child categories
 * @param {Array} props.subcategories - Subcategories array (filtered by category)
 * @param {Array} props.childCategories - Child categories array (filtered by subcategory)
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Filter change handler
 * @returns {JSX.Element} Filter sidebar component
 */
const FilterSidebar = ({ categories, subcategories, childCategories, filters, onFilterChange }) => {
  // Get subcategories for selected category
  const selectedCategory = categories.find(cat => cat.id === parseInt(filters.category))
  const availableSubcategories = selectedCategory?.subcategories || subcategories
  
  // Get child categories for selected subcategory
  const selectedSubcategory = availableSubcategories.find(sub => sub.id === parseInt(filters.subcategory))
  const availableChildCategories = selectedSubcategory?.child_categories || childCategories
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Filters container */}
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Search products..."
        />
      </div>

      {/* Category filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
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
            onChange={(e) => onFilterChange('subcategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Subcategories</option>
            {availableSubcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Child category filter */}
      {filters.subcategory && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Child Category</label>
          <select
            value={filters.childCategory}
            onChange={(e) => onFilterChange('childCategory', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Child Categories</option>
            {availableChildCategories.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
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
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
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
  )
}

export default FilterSidebar

