/**
 * Order History Page Component
 * Displays list of user's past orders
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import SkeletonLoader from '../components/SkeletonLoader'

/**
 * OrderHistory component
 * @returns {JSX.Element} Order history page
 */
const OrderHistory = () => {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  /**
   * Fetch user orders
   */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return

      try {
        setLoading(true)
        const response = await axios.get('/api/orders')
        setOrders(response.data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error(error.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated])

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  /**
   * Get order status badge
   * @param {Object} order - Order object
   * @returns {JSX.Element} Status badge
   */
  const getStatusBadge = (order) => {
    if (order.is_delivered) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Delivered</span>
    }
    if (order.is_paid) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Processing</span>
    }
    return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span>
  }

  if (!isAuthenticated) {
    return <ProtectedRoute><div></div></ProtectedRoute>
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading skeleton */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        <SkeletonLoader type="list" count={5} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

      {orders.length === 0 ? (
        /* Empty orders message */
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                {/* Order info */}
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    {getStatusBadge(order)}
                  </div>
                  <p className="text-gray-600 text-sm">
                    Placed on {formatDate(order.created_at)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {order.item_count} item(s)
                  </p>
                </div>

                {/* Order total */}
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistory

