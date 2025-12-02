/**
 * Admin Dashboard Page Component
 * Displays admin overview with statistics
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import StatsCard from '../../components/admin/StatsCard'
import ProtectedRoute from '../../components/ProtectedRoute'

/**
 * Dashboard component
 * @returns {JSX.Element} Admin dashboard page
 */
const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch dashboard statistics
   */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/admin/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
        toast.error(error.response?.data?.message || 'Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
        <SkeletonLoader type="list" count={2} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Dashboard header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Sales" value={`$${stats?.sales?.total.toFixed(2) || '0.00'}`} />
        <StatsCard title="Total Orders" value={stats?.orders?.total || 0} />
        <StatsCard title="Total Users" value={stats?.users?.total || 0} />
        <StatsCard title="Total Products" value={stats?.products?.total || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="block p-3 border rounded hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.user_name}</p>
                    </div>
                    <p className="font-semibold">${parseFloat(order.total_price).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent orders</p>
          )}
        </div>

        {/* Low stock products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Low Stock Products</h2>
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/admin/products/${product.id}`}
                  className="block p-3 border rounded hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">All products are well stocked</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

