/**
 * Period Filter Component
 * Dropdown/button group for selecting time period
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * PeriodFilter component
 * @param {Object} props - Component props
 * @param {string} props.period - Current selected period
 * @param {Function} props.onPeriodChange - Callback when period changes
 * @returns {JSX.Element} Period filter component
 */
const PeriodFilter = ({ period = 'month', onPeriodChange }) => {
  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ]

  return (
    <div className="flex items-center space-x-2">
      {/* Period filter container */}
      <label htmlFor="period-select" className="text-sm font-medium text-gray-700">
        Period:
      </label>
      <select
        id="period-select"
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {periods.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PeriodFilter
