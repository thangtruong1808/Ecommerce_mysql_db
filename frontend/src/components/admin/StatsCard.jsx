/**
 * Stats Card Component
 * Displays a statistic card for admin dashboard
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

/**
 * StatsCard component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Statistic value
 * @returns {JSX.Element} Stats card component
 */
const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Stats card container */}
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default StatsCard

