/**
 * Customer Growth Chart Component
 * Area chart showing customer growth over time
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

/**
 * CustomerGrowthChart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Customer growth data
 * @returns {JSX.Element} Customer growth chart component
 */
const CustomerGrowthChart = ({ data = [] }) => {
  // Format date for display
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return ''
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(dateStr + 'T00:00:00')
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    return dateStr
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: item.date || item.label || '',
    customers: parseInt(item.newCustomers || item.customers || item.count || item.value || 0),
    formattedDate: formatDateLabel(item.date || item.label || ''),
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-700">{data.formattedDate || data.date}</p>
          <p className="text-green-600 font-semibold">{data.customers} new customers</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Customer Growth</h2>
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              angle={chartData.length > 7 ? -45 : 0}
              textAnchor={chartData.length > 7 ? 'end' : 'middle'}
              height={chartData.length > 7 ? 80 : 30}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>} />
            <Area
              type="monotone"
              dataKey="customers"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCustomers)"
              name="New Customers"
              dot={{ r: 4, fill: '#10b981' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          No customer growth data available
        </div>
      )}
    </div>
  )
}

export default CustomerGrowthChart
