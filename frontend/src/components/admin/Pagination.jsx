/**
 * Pagination Component
 * Reusable pagination component for tables with enhanced features
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'

/**
 * Pagination component
 * @param {Object} props - Component props
 * @param {string} props.position - Position: 'top' or 'bottom' (default: 'bottom')
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.entriesPerPage - Entries per page
 * @param {Function} props.onPageChange - Page change callback
 * @param {Function} props.onEntriesChange - Entries per page change callback
 * @returns {JSX.Element} Pagination component
 * @author Thang Truong
 * @date 2025-12-12
 */
const Pagination = ({ 
  position = 'bottom',
  currentPage, 
  totalPages, 
  totalItems = 0,
  entriesPerPage = 10,
  onPageChange,
  onEntriesChange 
}) => {
  /**
   * Calculate current range
   * @returns {string} Range string
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getCurrentRange = () => {
    if (totalItems === 0) return 'Showing 0 entries'
    const start = (currentPage - 1) * entriesPerPage + 1
    const end = Math.min(currentPage * entriesPerPage, totalItems)
    return `Showing ${start}-${end} of ${totalItems} entries`
  }

  // Top section: Entries selector + range display
  if (position === 'top') {
    /* Pagination top section with entries selector */
    return (
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Entries per page selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Show entries:</label>
            <select
              value={entriesPerPage}
              onChange={(e) => onEntriesChange?.(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Range display */}
          <div className="text-sm text-gray-700">
            {getCurrentRange()}
          </div>
        </div>
      </div>
    )
  }

  // Bottom section: Navigation buttons + page info
  // Only show pagination if there are more than 10 items
  const totalItemsNum = parseInt(totalItems) || 0
  const totalPagesNum = parseInt(totalPages) || 1
  const currentPageNum = parseInt(currentPage) || 1
  
  if (totalItemsNum === 0 || totalItemsNum <= 10) return null

  /* Pagination navigation controls */
  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPageNum === 1}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="First page"
          >
            <FaAngleDoubleLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(Math.max(1, currentPageNum - 1))}
            disabled={currentPageNum === 1}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Previous page"
          >
            <FaAngleLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPageNum} of {totalPagesNum}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPagesNum, currentPageNum + 1))}
            disabled={currentPageNum === totalPagesNum}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Next page"
          >
            <FaAngleRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPagesNum)}
            disabled={currentPageNum === totalPagesNum}
            className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            aria-label="Last page"
          >
            <FaAngleDoubleRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pagination
