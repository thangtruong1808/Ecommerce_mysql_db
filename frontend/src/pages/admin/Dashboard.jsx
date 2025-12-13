/**
 * Admin Dashboard Page Component
 * Displays comprehensive admin overview with analytics, charts, and insights
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaDollarSign, FaShoppingCart, FaUsers, FaBox, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'
import AdminLayout from '../../components/admin/AdminLayout'
import MetricCard from '../../components/admin/MetricCard'
import PeriodFilter from '../../components/admin/PeriodFilter'
import RevenueChart from '../../components/admin/RevenueChart'
import SalesByCategoryChart from '../../components/admin/SalesByCategoryChart'
import OrderStatusChart from '../../components/admin/OrderStatusChart'
import CustomerGrowthChart from '../../components/admin/CustomerGrowthChart'
import RecentActivityFeed from '../../components/admin/RecentActivityFeed'
import SkeletonLoader from '../../components/SkeletonLoader'
import {
  fetchDashboardOverview,
  fetchRevenueChart,
  fetchSalesByCategory,
  fetchOrderStatistics,
  fetchCustomerInsights,
  fetchTopProducts,
  fetchRecentActivity,
  fetchPerformanceMetrics,
} from '../../utils/dashboardApi'

/**
 * Dashboard component
 * @returns {JSX.Element} Admin dashboard page
 */
/**
 * Dashboard component
 * Overview and analytics dashboard - no CRUD operations
 * @returns {JSX.Element} Admin dashboard page
 * @author Thang Truong
 * @date 2025-12-12
 */
const Dashboard = () => {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [orderStatusData, setOrderStatusData] = useState([])
  const [customerGrowthData, setCustomerGrowthData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [performanceMetrics, setPerformanceMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  /**
   * Fetch all dashboard data
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all dashboard data in parallel
      const [
        overviewData,
        revenue,
        categories,
        orderStats,
        customerData,
        products,
        activities,
        performance,
      ] = await Promise.all([
        fetchDashboardOverview(period),
        fetchRevenueChart(period),
        fetchSalesByCategory(period),
        fetchOrderStatistics(period),
        fetchCustomerInsights(period),
        fetchTopProducts(period, 10),
        fetchRecentActivity(15),
        fetchPerformanceMetrics(period),
      ])

      setStats(overviewData)
      setRevenueData(revenue || [])
      setCategoryData(categories || [])
      setOrderStatusData(orderStats?.statusBreakdown || [])
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
   * Handle period change
   * @param {string} newPeriod - New selected period
   */
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [period])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [period])

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
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
   * Format order number
   * @param {Object} order - Order object
   * @returns {string} Formatted order number
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatOrderNumber = (order) => {
    if (order.order_number) return order.order_number
    const date = new Date(order.created_at).toISOString().slice(0, 10).replace(/-/g, '')
    return `ORD-${date}-${String(order.id).padStart(5, '0')}`
  }

  /* Admin dashboard overview */
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <PeriodFilter period={period} onPeriodChange={handlePeriodChange} />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RevenueChart data={revenueData} period={period} />
        <SalesByCategoryChart data={categoryData} />
        <OrderStatusChart data={orderStatusData} />
        <CustomerGrowthChart data={customerGrowthData} />
      </div>

      {/* Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-2">
              {topProducts.map((product, index) => (
                <Link
                  key={product.id || index}
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => {
                const orderStatus = order.is_delivered ? 'delivered' : order.is_paid ? 'paid' : 'pending'
                return (
                  <Link
                    key={order.id}
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

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            Low Stock Products
          </h2>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
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
      </div>

      {/* Recent Activity Section */}
      <div className="mb-8">
        <RecentActivityFeed activities={recentActivities} />
      </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard

