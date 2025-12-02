/**
 * Error Message Component
 * Displays error messages to users
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * ErrorMessage component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry callback function
 * @returns {JSX.Element} Error message component
 */
const ErrorMessage = ({ message = 'An error occurred', onRetry }) => {
  return (
    <div className="text-center py-8">
      {/* Error container */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <p className="text-red-800 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage

