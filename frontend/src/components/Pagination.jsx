/**
 * Pagination Component
 * Displays pagination controls for navigating pages
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'

/**
 * Pagination component
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.limit - Items per page
 * @param {number} props.total - Total number of items
 * @param {Function} props.onPageChange - Callback when page changes
 * @returns {JSX.Element} Pagination component
 * @author Thang Truong
 * @date 2025-12-12
 */
const Pagination = ({ currentPage = 1, totalPages = 1, limit = 15, total = 0, onPageChange }) => {
  /**
   * Handle page change
   * @param {number} page - Page number to navigate to
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  /**
   * Generate page numbers to display
   * @returns {Array} Array of page numbers
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i)
        }
      }
    }
    return pages
  }

  if (totalPages <= 1) {
    return null // Don't show pagination if only one page
  }

  const pageNumbers = getPageNumbers()

  /**
   * Calculate range of items displayed on current page
   * @returns {Object} Object with start and end item numbers
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getItemRange = () => {
    const start = total === 0 ? 0 : (currentPage - 1) * limit + 1
    const end = Math.min(currentPage * limit, total)
    return { start, end }
  }

  const { start, end } = getItemRange()

  return (
    /* Pagination container */
    <div className="mt-8">
      {/* Pagination info */}
      <div className="flex justify-center items-center mb-4 text-sm text-gray-600">
        <span>
          Showing {start} to {end} of {total} items
        </span>
        <span className="mx-2">•</span>
        <span>
          {limit} items per page
        </span>
        <span className="mx-2">•</span>
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center space-x-2">
      {/* First page button */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="First page"
        title="First page"
      >
        <FaAngleDoubleLeft />
      </button>

      {/* Previous page button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
        title="Previous page"
      >
        <FaChevronLeft />
      </button>

      {/* Page number buttons */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 border rounded-md ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next page button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
        title="Next page"
      >
        <FaChevronRight />
      </button>

      {/* Last page button */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Last page"
        title="Last page"
      >
        <FaAngleDoubleRight />
      </button>
      </div>
    </div>
  )
}

export default Pagination

