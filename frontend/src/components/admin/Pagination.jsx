/**
 * Pagination Component
 * Reusable pagination component for tables
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * Pagination component
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Page change callback
 * @returns {JSX.Element} Pagination component
 * @author Thang Truong
 * @date 2025-12-12
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  /* Pagination controls */
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
