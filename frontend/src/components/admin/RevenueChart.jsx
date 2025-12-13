/**
 * Revenue Chart Component
 * Line chart showing revenue trends over time
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

/**
 * RevenueChart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Revenue data array
 * @param {string} props.period - Current time period (today, week, month, year, all)
 * @returns {JSX.Element} Revenue chart component
 */
const RevenueChart = ({ data = [], period = 'month' }) => {
  // Format date based on period for better readability
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return ''
    
    // If it's already a formatted date string (YYYY-MM-DD), format it
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr + 'T00:00:00')
      if (period === 'today') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' })
      }
      if (period === 'week' || period === 'month') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
      if (period === 'year') {
        return date.toLocaleDateString('en-US', { month: 'short' })
      }
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    
    // If it's YYYY-MM format (monthly grouping)
    if (dateStr.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = dateStr.split('-')
      const date = new Date(year, parseInt(month) - 1)
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    
    // Return as is if no pattern matches
    return dateStr
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: item.date || item.label || '',
    revenue: parseFloat(item.revenue || item.value || 0),
    formattedDate: formatDateLabel(item.date || item.label || ''),
  }))

  // Format currency for tooltip
  const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-700">{data.formattedDate || data.date}</p>
          <p className="text-blue-600 font-semibold">{formatCurrency(data.revenue)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Revenue chart container */}
      <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              angle={chartData.length > 7 ? -45 : 0}
              textAnchor={chartData.length > 7 ? 'end' : 'middle'}
              height={chartData.length > 7 ? 80 : 30}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }} 
              tickFormatter={formatCurrency}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Revenue"
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          No revenue data available
        </div>
      )}
    </div>
  )
}

export default RevenueChart
