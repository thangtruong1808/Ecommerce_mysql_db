/**
 * Navigation Bar Component
 * Main navigation component with links and user menu
 * 
 * @author Thang Truong
 * @date 2025-12-09
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * Navbar component
 * @returns {JSX.Element} Navigation bar
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { getItemCount } = useCart()
  const [categories, setCategories] = useState([])
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const closeTimerRef = useRef(null)

  /**
   * Handle logout click
   */
  const handleLogout = async () => {
    await logout()
  }

  /**
   * Fetch categories with nested subcategories/child categories
   */
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true)
      const response = await axios.get('/api/products/categories')
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories for navbar:', error)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  /**
   * Open mega menu (clears pending close)
   */
  const handleOpenMega = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsMegaOpen(true)
  }

  /**
   * Close mega menu with slight delay for pointer transitions
   */
  const handleCloseMega = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = setTimeout(() => {
      setIsMegaOpen(false)
      closeTimerRef.current = null
    }, 150)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <nav className="bg-white shadow-md">
      {/* Navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Ecommerce Store
          </Link>
          
          {/* Navigation links */}
          <div className="flex space-x-4 items-center">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>

            {/* Products mega menu trigger */}
            <div
              className="relative"
              onMouseEnter={handleOpenMega}
              onMouseLeave={handleCloseMega}
            >
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
              >
                Products
                <span className="ml-1 text-xs text-gray-500">{isLoadingCategories ? '...' : '▼'}</span>
              </button>

              {/* Full-width mega menu panel */}
              {isMegaOpen && (
                <div
                  className="fixed left-0 right-0 top-16 bg-white shadow-2xl border-t border-gray-100 z-40"
                  onMouseEnter={handleOpenMega}
                  onMouseLeave={handleCloseMega}
                >
                  <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
                    {/* Categories column */}
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <Link
                          to={`/products?category=${category.id}`}
                          className="block text-base font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {category.name}
                        </Link>
                        <div className="space-y-2">
                          {(category.subcategories || []).map((sub) => (
                            <div key={sub.id} className="space-y-1">
                              <Link
                                to={`/products?subcategory=${sub.id}`}
                                className="block text-sm font-medium text-gray-800 hover:text-blue-600"
                              >
                                {sub.name}
                              </Link>
                              <div className="flex flex-wrap gap-2">
                                {(sub.child_categories || []).map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/products?childCategory=${child.id}`}
                                    className="text-xs text-gray-600 hover:text-blue-600 bg-gray-50 px-2 py-1 rounded"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/clearance"
              className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium font-semibold"
            >
              Clearance
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium relative"
            >
              Cart
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  to="/invoices"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Invoices
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
