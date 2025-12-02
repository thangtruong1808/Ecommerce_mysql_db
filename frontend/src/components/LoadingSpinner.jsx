/**
 * Loading Spinner Component
 * Reusable loading spinner component
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * LoadingSpinner component
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message
 * @param {string} props.size - Spinner size ('sm', 'md', 'lg')
 * @returns {JSX.Element} Loading spinner component
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Spinner container */}
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  )
}

export default LoadingSpinner

