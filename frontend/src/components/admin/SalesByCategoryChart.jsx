/**
 * Sales by Category Chart Component
 * Pie chart showing revenue by category
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

/**
 * SalesByCategoryChart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Sales data by category
 * @returns {JSX.Element} Sales by category chart component
 */
const SalesByCategoryChart = ({ data = [] }) => {
  // Format data for chart
  const chartData = data.map((item) => ({
    name: item.category || item.name || 'Unknown',
    value: parseFloat(item.revenue || item.value || 0),
  }))

  // Color palette for pie chart
  const COLORS = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#84cc16',
  ]

  // Format currency for tooltip
  const formatCurrency = (value) => `$${parseFloat(value).toFixed(2)}`

  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-600">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Sales by Category</h2>
      {chartData.length > 0 ? (
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              labelStyle={{ fontSize: '12px' }}
              label={({ name, percent }) =>
                percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''
              }
              outerRadius={82}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={1}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span style={{ fontSize: '12px' }}>{value}</span>}
            />
          </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 text-gray-500">
          No category data available
        </div>
      )}
    </div>
  )
}

export default SalesByCategoryChart
