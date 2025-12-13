/**
 * Order Status Chart Component
 * Bar chart showing order counts by status
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

/**
 * OrderStatusChart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Order status data
 * @returns {JSX.Element} Order status chart component
 */
const OrderStatusChart = ({ data = [] }) => {
  // Format data for chart
  const chartData = data.map((item) => ({
    status: item.status || item.name || 'Unknown',
    count: parseInt(item.count || item.value || 0),
  }))

  // Status color mapping
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('pending')) return '#f59e0b'
    if (statusLower.includes('processing')) return '#3b82f6'
    if (statusLower.includes('paid')) return '#10b981'
    if (statusLower.includes('delivered')) return '#8b5cf6'
    if (statusLower.includes('cancelled')) return '#ef4444'
    return '#6b7280'
  }

  // Format status name for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  // Custom tooltip for order status
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-700">{formatStatus(data.status)}</p>
          <p className="text-blue-600 font-semibold">{data.count} orders</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Orders by Status</h2>
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="status"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={formatStatus}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              dataKey="count"
              name="Orders"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getStatusColor(entry.status)}
                />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          No order status data available
        </div>
      )}
    </div>
  )
}

export default OrderStatusChart
