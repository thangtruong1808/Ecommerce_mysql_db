/**
 * Metric Card Component
 * Enhanced stats card with trend indicators
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaArrowUp, FaArrowDown } from 'react-icons/fa'

/**
 * MetricCard component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Statistic value
 * @param {number} props.change - Percentage change from previous period
 * @param {string} props.icon - Optional icon component
 * @returns {JSX.Element} Metric card component
 */
const MetricCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50'

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Metric card container */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && change !== null && (
            <div className={`mt-3 flex items-center text-sm ${changeColor}`}>
              {isPositive ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>
              <span className="ml-1 text-gray-600">vs previous period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`text-xl ${changeColor}`} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
