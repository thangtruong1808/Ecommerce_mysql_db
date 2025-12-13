/**
 * Search Filter Bar Component
 * Reusable search and filter bar for management pages
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaSearch } from 'react-icons/fa'

/**
 * SearchFilterBar component
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Search term value
 * @param {Function} props.onSearchChange - Search change callback
 * @param {string} props.filterValue - Filter value
 * @param {Function} props.onFilterChange - Filter change callback
 * @param {Array} props.filterOptions - Filter options [{value, label}]
 * @param {string} props.searchPlaceholder - Search placeholder text
 * @returns {JSX.Element} Search filter bar component
 * @author Thang Truong
 * @date 2025-12-12
 */
const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions = [],
  searchPlaceholder = 'Search...'
}) => {
  /* Search and filter bar */
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {filterOptions.length > 0 && (
          <select
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

export default SearchFilterBar
