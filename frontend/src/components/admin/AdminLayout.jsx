/**
 * Admin Layout Component
 * Layout wrapper for admin pages with navigation
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * AdminLayout component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @returns {JSX.Element} Admin layout component
 */
const AdminLayout = ({ children }) => {
  const location = useLocation()
  const { user } = useAuth()

  /**
   * Check if route is active
   * @param {string} path - Route path
   * @returns {boolean} True if active
   */
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin navigation */}
      <div className="bg-white shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Admin title */}
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            
            {/* Admin navigation links */}
            <div className="flex space-x-4">
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/dashboard')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/products')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/orders')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Orders
              </Link>
              <Link
                to="/admin/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/admin/users')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Users
              </Link>
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin content */}
      {children}
    </div>
  )
}

export default AdminLayout

