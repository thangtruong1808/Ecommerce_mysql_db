/**
 * Skeleton Loader Component
 * Reusable skeleton loading component for different content types
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * SkeletonLoader component
 * @param {Object} props - Component props
 * @param {string} props.type - Skeleton type ('card', 'text', 'table', 'list')
 * @param {number} props.count - Number of skeleton items
 * @returns {JSX.Element} Skeleton loader component
 */
const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  /**
   * Render card skeleton
   * @returns {JSX.Element} Card skeleton
   */
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Card skeleton */}
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  )

  /**
   * Render text skeleton
   * @returns {JSX.Element} Text skeleton
   */
  const renderTextSkeleton = () => (
    <div className="space-y-2 animate-pulse">
      {/* Text skeleton */}
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  )

  /**
   * Render table skeleton
   * @returns {JSX.Element} Table skeleton
   */
  const renderTableSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Table skeleton */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-4"></div></th>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-8"></div></th>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-16"></div></th>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-24"></div></th>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-20"></div></th>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-32"></div></th>
            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-24"></div></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-4"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
              <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  /**
   * Render list skeleton
   * @returns {JSX.Element} List skeleton
   */
  const renderListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      {/* List skeleton */}
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return renderCardSkeleton()
      case 'text':
        return renderTextSkeleton()
      case 'table':
        return renderTableSkeleton()
      case 'list':
        return renderListSkeleton()
      default:
        return renderCardSkeleton()
    }
  }

  return (
    <div>
      {/* Skeleton container */}
      {count > 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(count)].map((_, i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      ) : (
        renderSkeleton()
      )}
    </div>
  )
}

export default SkeletonLoader

