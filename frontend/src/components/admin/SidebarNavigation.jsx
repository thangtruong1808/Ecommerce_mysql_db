/**
 * Sidebar Navigation Component
 * Toggleable sidebar navigation for admin panel with logo and logout
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logoImage from '../../assets/images/Logo.png'
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaTag, 
  FaComment,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaImages,
  FaVideo
} from 'react-icons/fa'

/**
 * SidebarNavigation component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether sidebar is open
 * @param {Function} props.onToggle - Toggle sidebar callback
 * @returns {JSX.Element} Sidebar navigation component
 * @author Thang Truong
 * @date 2025-12-12
 */
const SidebarNavigation = ({ isOpen, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

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
   * Handle logout
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleLogout = async () => {
    await logout()
    navigate('/login')
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
    { path: '/admin/images', label: 'Images', icon: FaImages },
    { path: '/admin/videos', label: 'Videos', icon: FaVideo },
  ]

  /* Sidebar navigation */
  return (
    <>
      {/* Toggle button - positioned to avoid content overlap */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-[100] bg-gray-900 text-white p-2.5 rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg flex items-center justify-center"
          style={{ 
            minWidth: '40px',
            minHeight: '40px'
          }}
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-lg" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 h-full w-64 bg-gray-900 transition-transform duration-300 z-40`}>
        <div className="p-4 h-full flex flex-col">
          {/* Header with toggle button and logo */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Ecommerce Store Logo" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              {isOpen && (
                <button
                  onClick={onToggle}
                  className="ml-2 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                  style={{ 
                    minWidth: '36px',
                    minHeight: '36px'
                  }}
                  aria-label="Toggle sidebar"
                >
                  <FaTimes className="text-base" />
                </button>
              )}
            </div>
            <p className="text-white text-sm text-center">
              Welcome to Admin Panel. Manage your store efficiently.
            </p>
          </div>
          {/* Navigation items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white text-lg'
                      : 'text-lg text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom links */}
          <div className="mt-auto space-y-2 pt-4 border-t border-gray-700">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-lg text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaHome className="mr-3" />
              <span>Back to Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-lg text-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}

export default SidebarNavigation
