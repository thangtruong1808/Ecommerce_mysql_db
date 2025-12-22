/**
 * Search Filter Bar Component
 * Reusable search and filter bar for management pages
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useRef, useEffect } from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'

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
 * @date 2025-12-17
 */
const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions = [],
  searchPlaceholder = 'Search...'
}) => {
  const inputRef = useRef(null)

  /**
   * Maintain input focus after parent re-renders
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart
      inputRef.current.focus()
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [searchTerm])

  /**
   * Handle search input change
   * Allows spaces to be entered freely in search terms
   * @param {Event} e - Input change event
   * @author Thang Truong
   * @date 2025-01-28
   */
  const handleSearchChange = (e) => {
    const value = e.target.value
    // Allow spaces in search terms - don't trim on every keystroke
    // Spaces are valid in search queries (e.g., "red shirt", "user name")
    onSearchChange(String(value))
  }

  /* Search and filter bar */
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
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
