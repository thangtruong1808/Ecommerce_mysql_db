/**
 * Admin Dashboard Page Component
 * Displays comprehensive admin overview with analytics, charts, and insights
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaDollarSign, FaShoppingCart, FaUsers, FaBox, FaChartLine, FaExclamationTriangle, FaClock, FaTachometerAlt } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import MetricCard from '../../components/admin/MetricCard'
import PeriodFilter from '../../components/admin/PeriodFilter'
import SalesByCategoryChart from '../../components/admin/SalesByCategoryChart'
import CustomerGrowthChart from '../../components/admin/CustomerGrowthChart'
import SkeletonLoader from '../../components/SkeletonLoader'
import {
  fetchDashboardOverview,
  fetchSalesByCategory,
  fetchCustomerInsights,
  fetchTopProducts,
  fetchRecentActivity,
  fetchPerformanceMetrics,
} from '../../utils/dashboardApi'

/**
 * Get activity icon based on activity type
 * @param {string} type - Activity type (order, review, comment, registration)
 * @returns {string} Emoji icon for the activity type
 * @author Thang Truong
 * @date 2025-12-17
 */
const getActivityIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'order': return '🛒'
    case 'review': return '⭐'
    case 'comment': return '💬'
    case 'registration': return '👤'
    default: return '📦'
  }
}

/**
 * Format date to relative time string
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted relative time (e.g., "5m ago", "2h ago")
 * @author Thang Truong
 * @date 2025-12-17
 */
const formatActivityDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

/**
 * Dashboard component
 * Overview and analytics dashboard - no CRUD operations
 * @returns {JSX.Element} Admin dashboard page
 * @author Thang Truong
 * @date 2025-12-17
 */
const Dashboard = () => {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [customerGrowthData, setCustomerGrowthData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [performanceMetrics, setPerformanceMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  /**
   * Fetch all dashboard data
   * Loads overview, categories, customer data, products, activities, and performance metrics
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all dashboard data in parallel
      const [
        overviewData,
        categories,
        customerData,
        products,
        activities,
        performance,
      ] = await Promise.all([
        fetchDashboardOverview(period),
        fetchSalesByCategory(period),
        fetchCustomerInsights(period),
        fetchTopProducts(period, 10),
        fetchRecentActivity(15),
        fetchPerformanceMetrics(period),
      ])

      setStats(overviewData)
      setCategoryData(categories || [])
      setCustomerGrowthData(customerData?.growthData || [])
      setTopProducts(products || [])
      setRecentActivities(activities || [])
      setPerformanceMetrics(performance)
      setLastUpdated(new Date())
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle period change event
   * Updates the selected time period for dashboard data
   * @param {string} newPeriod - New selected period (day, week, month, year)
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
  }

  /**
   * Fetch dashboard data when period changes
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    fetchDashboardData()
  }, [period])

  /**
   * Auto-refresh dashboard data every 5 minutes
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [period])

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="max-w-full mx-auto">
          {/* Loading skeleton */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
          <SkeletonLoader type="list" count={2} />
        </div>
      </AdminLayout>
    )
  }

  // Calculate metrics with trends (placeholder - will be replaced when analytics endpoints are available)
  const totalRevenue = stats?.sales?.total || 0
  const totalOrders = stats?.orders?.total || 0
  const totalCustomers = stats?.users?.total || 0
  const totalProducts = stats?.products?.total || 0
  const avgOrderValue = performanceMetrics?.aov || (totalOrders > 0 ? totalRevenue / totalOrders : 0)
  const conversionRate = performanceMetrics?.conversionRate || 0

  /**
   * Format order number for display
   * Generates order number from order ID and creation date
   * @param {Object} order - Order object with id, order_number, and created_at
   * @returns {string} Formatted order number (ORD-YYYYMMDD-XXXXX)
   * @author Thang Truong
   * @date 2025-12-17
   */
  const formatOrderNumber = (order) => {
    if (order.order_number) return order.order_number
    const date = new Date(order.created_at).toISOString().slice(0, 10).replace(/-/g, '')
    return `ORD-${date}-${String(order.id).padStart(5, '0')}`
  }

  /* Admin dashboard overview with metrics, charts, and activity sections */
  return (
    <AdminLayout>
      <div className="max-w-full mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-evenly sm:items-center mb-2">
        {/* Left group: Icon + Title + Last Updated */}
        <div className="flex flex-col sm:flex-row items-center justify-center mb-2">
          <FaTachometerAlt className="text-blue-600 text-2xl sm:mr-2 md:mr-2 " />
          <h1 className="text-3xl font-bold text-gray-900 text-center mr-2 mt-2 sm:mt-0">Admin Dashboard</h1>
          
           {lastUpdated && (
            <p className="text-sm text-gray-500 flex items-center">
              <FaClock className="mr-1" /> Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        {/* Period filter */}
        <div className="flex items-center justify-center sm:mt-4 md:mt-0">
          <PeriodFilter period={period} onPeriodChange={handlePeriodChange} />
        </div>
      </div>

      {/* Divider between header and key metrics */}
      <div className="my-2 mb-4"><hr /></div>

      {/* Key Metrics Row - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-2">
        <MetricCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change={performanceMetrics?.revenueGrowth}
          icon={FaDollarSign}
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders}
          change={performanceMetrics?.ordersGrowth}
          icon={FaShoppingCart}
        />
        <MetricCard
          title="New Customers"
          value={performanceMetrics?.newCustomers || 0}
          change={performanceMetrics?.customersGrowth}
          icon={FaUsers}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          change={performanceMetrics?.aovGrowth}
          icon={FaChartLine}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate.toFixed(1)}%`}
          change={performanceMetrics?.conversionGrowth}
          icon={FaChartLine}
        />
        <MetricCard
          title="Total Products"
          value={totalProducts}
          icon={FaBox}
        />
      </div>

      {/* Charts Section - Increased size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
        <div className="h-80">
          <SalesByCategoryChart data={categoryData} />
        </div>
        <div className="h-80">
          <CustomerGrowthChart data={customerGrowthData} />
        </div>
      </div>

      {/* Data Tables Section - Increased size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {topProducts.map((product, index) => (
                <Link
                  key={`top-product-${product.id || product.product_id || index}`}
                  to={`/admin/products/${product.id}`}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium text-blue-600">{product.name || product.product_name}</span>
                  <div className="text-right text-sm">
                    <span className="text-gray-600 mr-4">{product.units_sold || product.quantity || 0} sold</span>
                    <span className="font-semibold">${parseFloat(product.revenue || product.total_revenue || 0).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No product data available</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.recentOrders.map((order, orderIndex) => {
                const orderStatus = order.is_delivered ? 'delivered' : order.is_paid ? 'paid' : 'pending'
                return (
                  <Link
                    key={`recent-order-${order.id || orderIndex}`}
                    to={`/admin/orders/${order.id}`}
                    className="block p-3 border rounded hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatOrderNumber(order)}
                        </p>
                        <p className="text-sm text-gray-600">{order.user_name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                            orderStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : orderStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {orderStatus}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600">No recent orders</p>
          )}
        </div>
      </div>

      {/* Low Stock and Recent Activity Section - Side by side with same height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-0">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-80">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Low Stock Products
          </h2>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-2 flex-1 overflow-y-auto">
              {stats.lowStockProducts.map((product, productIndex) => (
                <Link
                  key={`low-stock-${product.id || productIndex}`}
                  to={`/admin/products/${product.id}`}
                  className="block p-3 border rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Current stock: <span className="font-semibold text-red-600">{product.stock}</span>
                      </p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded">
                      Low Stock
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">All products are well stocked</p>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col h-80">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={`activity-${index}-${activity.id || activity.createdAt || activity.created_at || activity.date || Date.now()}`} className="flex items-start space-x-2 pb-2 border-b border-gray-200 last:border-0">
                    <span className="text-base mt-0.5">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description || activity.message || 'Activity'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatActivityDate(activity.createdAt || activity.created_at || activity.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard

