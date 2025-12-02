/**
 * Order Management Page Component
 * Admin page for managing all orders
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '../../components/admin/AdminLayout'
import ProtectedRoute from '../../components/ProtectedRoute'
import SkeletonLoader from '../../components/SkeletonLoader'

/**
 * OrderManagement component
 * @returns {JSX.Element} Order management page
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  /**
   * Fetch orders
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const params = statusFilter ? `?status=${statusFilter}` : ''
        const response = await axios.get(`/api/admin/orders${params}`)
        setOrders(response.data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error(error.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [statusFilter])

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  /**
   * Get status badge
   * @param {Object} order - Order object
   * @returns {JSX.Element} Status badge
   */
  const getStatusBadge = (order) => {
    if (order.is_delivered) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Delivered</span>
    }
    if (order.is_paid) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Processing</span>
    }
    return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading skeleton */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h1>
          <SkeletonLoader type="table" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {/* Table header */}
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Table rows */}
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default OrderManagement

