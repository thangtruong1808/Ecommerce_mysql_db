/**
 * Sortable Table Header Component
 * Table header with sorting functionality
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

/**
 * SortableTableHeader component
 * @param {Object} props - Component props
 * @param {string} props.label - Header label
 * @param {string} props.field - Field name for sorting
 * @param {string} props.currentSort - Current sort field
 * @param {string} props.sortOrder - Current sort order ('asc' or 'desc')
 * @param {Function} props.onSort - Sort callback (field, order)
 * @returns {JSX.Element} Sortable table header component
 * @author Thang Truong
 * @date 2025-12-12
 */
const SortableTableHeader = ({ label, field, currentSort, sortOrder, onSort }) => {
  /**
   * Handle header click
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleClick = () => {
    if (currentSort === field) {
      // Toggle order if same field
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      onSort(field, 'asc')
    }
  }

  /**
   * Get sort icon
   * @returns {JSX.Element} Sort icon
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getSortIcon = () => {
    if (currentSort !== field) {
      return <FaSort className="ml-1 text-gray-400" />
    }
    if (sortOrder === 'asc') {
      return <FaSortUp className="ml-1 text-blue-600" />
    }
    return <FaSortDown className="ml-1 text-blue-600" />
  }

  /* Sortable table header */
  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <span>{label}</span>
        {getSortIcon()}
      </div>
    </th>
  )
}

export default SortableTableHeader
