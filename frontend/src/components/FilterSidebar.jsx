/**
 * Filter Sidebar Component
 * Displays product filters (search, category, subcategory, child category, price, sort)
 * Handles hierarchical category filtering with proper data flow
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

/**
 * FilterSidebar component
 * @param {Object} props - Component props
 * @param {Array} props.categories - Categories array with nested subcategories and child categories
 * @param {Array} props.subcategories - Subcategories array (filtered by category)
 * @param {Array} props.childCategories - Child categories array (filtered by subcategory)
 * @param {Object} props.filters - Current filter values
 * @param {string} props.searchValue - Debounced search display value
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Function} props.onClear - Clear all filters handler
 * @returns {JSX.Element} Filter sidebar component
 */
const FilterSidebar = ({ categories, subcategories, childCategories, filters, searchValue, onFilterChange, onClear }) => {
  /**
   * Get available subcategories for selected category
   * Prioritizes nested subcategories from selected category
   * @author Thang Truong
   * @date 2025-12-17
   */
  const selectedCategory = categories.find(cat => cat.id === parseInt(filters.category))
  const availableSubcategories = selectedCategory?.subcategories || subcategories
  
  /**
   * Get available child categories for selected subcategory
   * Prioritizes nested child_categories from selected subcategory
   * Falls back to childCategories prop if nested data not available
   * @author Thang Truong
   * @date 2025-12-17
   */
  const selectedSubcategory = availableSubcategories.find(sub => sub.id === parseInt(filters.subcategory))
  const availableChildCategories = (selectedSubcategory?.child_categories && Array.isArray(selectedSubcategory.child_categories) && selectedSubcategory.child_categories.length > 0)
    ? selectedSubcategory.child_categories
    : (Array.isArray(childCategories) ? childCategories : [])
  
  /* Filter sidebar container with all filter controls */
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Filters header */}
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Search input field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Search products..."
        />
      </div>

      {/* Category dropdown filter */}
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

      {/* Subcategory dropdown filter - shown when category is selected */}
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

      {/* Child category dropdown filter - shown when subcategory is selected */}
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

      {/* Price range filter with min and max inputs */}
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

      {/* Sort dropdown filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
        <select
          value={`${filters.sortBy}|${filters.sortOrder || 'DESC'}`}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="created_at|DESC">Newest</option>
          <option value="price|ASC">Price: Low to High</option>
          <option value="price|DESC">Price: High to Low</option>
          <option value="name|ASC">Name: A to Z</option>
          <option value="rating|DESC">Highest Rated</option>
        </select>
      </div>

      {/* Clear all filters button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onClear}
          className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear all filters
        </button>
      </div>
    </div>
  )
}

export default FilterSidebar

