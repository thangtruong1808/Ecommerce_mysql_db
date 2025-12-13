/**
 * Sidebar Navigation Component
 * Sidebar navigation for admin panel
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link, useLocation } from 'react-router-dom'
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaTag, 
  FaComment,
  FaHome
} from 'react-icons/fa'

/**
 * SidebarNavigation component
 * @returns {JSX.Element} Sidebar navigation component
 * @author Thang Truong
 * @date 2025-12-12
 */
const SidebarNavigation = () => {
  const location = useLocation()

  /**
   * Check if route is active
   * @param {string} path - Route path
   * @returns {boolean} True if active
   * @author Thang Truong
   * @date 2025-12-12
   */
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  /**
   * Navigation items configuration
   * @returns {Array} Navigation items
   * @author Thang Truong
   * @date 2025-12-12
   */
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/products', label: 'Products', icon: FaBox },
    { path: '/admin/orders', label: 'Orders', icon: FaShoppingCart },
    { path: '/admin/users', label: 'Users', icon: FaUsers },
    { path: '/admin/vouchers', label: 'Vouchers', icon: FaTag },
    { path: '/admin/comments', label: 'Comments', icon: FaComment },
  ]

  /* Sidebar navigation */
  return (
    <div className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0 pt-16">
      <div className="p-4">
        <h2 className="text-white text-xl font-bold mb-6 px-4">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <Link
            to="/"
            className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-8"
          >
            <FaHome className="mr-3" />
            <span>Back to Store</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default SidebarNavigation
