/**
 * Navigation Bar Component - Responsive navbar with mobile menu
 * @author Thang Truong
 * @date 2025-01-28
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import logoImage from '../assets/images/Logo.png'
import { FaUserCircle, FaSignOutAlt, FaShoppingBag, FaFileInvoice, FaUser, FaCog, FaBars, FaTimes, FaSearch, FaHome, FaBoxOpen, FaTag, FaShoppingCart, FaSignInAlt, FaFolder } from 'react-icons/fa'
import { loadCategories, clearCategoryCache } from '../utils/categoryCache'

/**
 * Navbar component
 * @returns {JSX.Element} Navigation bar
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { getItemCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const closeTimerRef = useRef(null)
  const categoryCloseTimerRef = useRef(null)
  const userMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navRef = useRef(null)
  const [megaMenuTop, setMegaMenuTop] = useState(0)

  /**
   * Check if a path is currently active
   * @param {string} path - Path to check
   * @param {boolean} exact - Whether to match exactly
   * @returns {boolean} True if path is active
   * @author Thang Truong
   * @date 2025-12-12
   */
  const isActive = (path, exact = false) => exact ? location.pathname === path : location.pathname.startsWith(path)

  /**
   * Handle logout click with toast notification
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Failed to logout. Please try again.')
    }
  }

  /**
   * Fetch categories with nested subcategories/child categories
   * Clears cache on first load to ensure fresh data with child categories
   * @author Thang Truong
   * @date 2025-12-17
   */
  const fetchCategories = async () => {
    if (isLoadingCategories) return
    try {
      setIsLoadingCategories(true)
      // Clear cache to ensure we get fresh data with child categories
      if (categories.length === 0) {
        clearCategoryCache()
      }
      const data = await loadCategories()
      setCategories(data || [])
    } catch {} finally { setIsLoadingCategories(false) }
  }

  /**
   * Handle category hover - opens mega menu for specific category
   * @param {number} categoryId - Category ID to show mega menu for
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleCategoryHover = (categoryId) => {
    if (categoryCloseTimerRef.current) {
      clearTimeout(categoryCloseTimerRef.current)
      categoryCloseTimerRef.current = null
    }
    setHoveredCategoryId(categoryId)
  }

  /**
   * Handle category leave - closes mega menu with delay
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleCategoryLeave = () => {
    if (categoryCloseTimerRef.current) clearTimeout(categoryCloseTimerRef.current)
    categoryCloseTimerRef.current = setTimeout(() => {
      setHoveredCategoryId(null)
      categoryCloseTimerRef.current = null
    }, 150)
  }

  /**
   * Open mega menu (clears pending close) - for mobile menu
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleOpenMega = () => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
    setIsMegaOpen(true)
  }

  /**
   * Close mega menu with slight delay for pointer transitions - for mobile menu
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCloseMega = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setIsMegaOpen(false)
      closeTimerRef.current = null
    }, 150)
  }

  /**
   * Open filters drawer on products page
   * @author Thang Truong
   * @date 2025-12-12
   */
  const openFilterDrawer = () => {
    if (location.pathname.startsWith('/products')) {
      window.dispatchEvent(new CustomEvent('toggle-filters'))
    } else {
      navigate('/products?openFilters=1')
    }
  }

  /**
   * Toggle user menu dropdown
   * @author Thang Truong
   * @date 2025-12-12
   */
  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev)
  /**
   * Close user menu
   * @author Thang Truong
   * @date 2025-12-12
   */
  const closeUserMenu = () => setIsUserMenuOpen(false)
  /**
   * Toggle mobile menu
   * @author Thang Truong
   * @date 2025-12-12
   */
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev)
  /**
   * Close mobile menu
   * @author Thang Truong
   * @date 2025-12-12
   */
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  /**
   * Handle click outside user menu and mobile menu to close them
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) closeUserMenu()
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) closeMobileMenu()
    }
    if (isUserMenuOpen || isMobileMenuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen, isMobileMenuOpen])

  useEffect(() => { fetchCategories() }, [])

  /**
   * Calculate mega menu top position based on navbar height
   * Updates on categories load and window resize
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const updateMegaMenuTop = () => {
      if (navRef.current) {
        setMegaMenuTop(navRef.current.offsetHeight)
      }
    }
    updateMegaMenuTop()
    window.addEventListener('resize', updateMegaMenuTop)
    return () => window.removeEventListener('resize', updateMegaMenuTop)
  }, [categories])

  /**
   * Get category icon and color - returns consistent icon for all categories
   * @param {string} categoryName - Category name
   * @returns {Object} Icon component and color class
   * @author Thang Truong
   * @date 2025-12-17
   */
  const getCategoryStyle = (categoryName) => {
    // Use consistent icon for all categories
    const icon = <FaFolder className="mr-2" />
    // Use consistent color for all categories
    const color = 'text-blue-600'
    return { icon, color }
  }

  // Menu items configuration
  const menuItems = [
    { to: '/profile', icon: FaUser, label: 'Profile' },
    { to: '/orders', icon: FaShoppingBag, label: 'Orders' },
    { to: '/invoices', icon: FaFileInvoice, label: 'Invoices' },
  ]

  /* Navigation bar layout - two rows structure */
  return (
    <nav ref={navRef} className="bg-blue-600 shadow-md relative">
      {/* Row 1 - Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand with friendly description */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="Ecommerce Store Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">Badminton Stores</span>
              <span className="text-xs text-blue-100 hidden sm:block">Your trusted shopping destination</span>
            </div>
          </Link>
          
          {/* Desktop navigation links - hidden on mobile */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/', true) ? 'text-white bg-blue-700 font-semibold' : 'text-white hover:text-blue-100'}`}>
              <FaHome className="mr-1.5" /> Home
            </Link>
            {/* Products link - no mega menu trigger */}
            <Link to="/products" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/products') ? 'text-white bg-blue-700 font-semibold' : 'text-white hover:text-blue-100'}`}>
              <FaBoxOpen className="mr-1.5" /> Products
            </Link>
            <button type="button" onClick={openFilterDrawer} aria-controls="product-filters-drawer" aria-expanded="false" aria-haspopup="dialog" className="px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors text-white hover:text-blue-100" aria-label="Open product filters">
              <FaSearch className="mr-1" /> <span className="text-md">Filters</span>
            </button>
            <Link to="/clearance" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/clearance') ? 'bg-red-500 text-white font-bold' : 'bg-red-500 text-white hover:text-white/80 font-semibold'}`}>
              <FaTag className="mr-1.5" /> <span className="text-md">Clearance</span>
            </Link>
            <Link to="/cart" className={`px-3 py-2 rounded-md text-sm font-medium relative inline-flex items-center transition-colors ${isActive('/cart') ? 'text-white bg-blue-700 font-semibold' : 'text-white hover:text-blue-100'}`}>
              <FaShoppingCart className="mr-1.5" /> <span className="text-md">Cart</span>
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getItemCount()}</span>
              )}
            </Link>
            {/* User menu dropdown for authenticated users */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button type="button" onClick={toggleUserMenu} className="flex items-center space-x-2 text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <FaUserCircle className="text-xl" /> <span>{user?.name}</span> <span className="text-xs text-blue-100">{isUserMenuOpen ? '▲' : '▼'}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {menuItems.map((item) => (
                      <Link key={item.to} to={item.to} onClick={closeUserMenu} className={`flex items-center space-x-2 px-4 py-3 text-sm transition-colors ${isActive(item.to) ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <item.icon className={isActive(item.to) ? 'text-blue-500' : 'text-gray-400'} /> <span>{item.label}</span>
                      </Link>
                    ))}
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" onClick={closeUserMenu} className={`flex items-center space-x-2 px-4 py-3 text-sm border-t border-gray-100 transition-colors ${isActive('/admin') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <FaCog className={isActive('/admin') ? 'text-blue-500' : 'text-gray-400'} /> <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button onClick={() => { closeUserMenu(); handleLogout(); }} className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100">
                      <FaSignOutAlt className="text-red-400" /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/login') ? 'text-white bg-blue-700 font-semibold' : 'text-white hover:text-blue-100'}`}>
                <FaSignInAlt className="mr-1.5" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button and cart - visible on mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/cart" className="text-white hover:text-blue-100 px-2 py-2 relative">
              <FaShoppingBag className="text-xl" />
              {getItemCount() > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getItemCount()}</span>}
            </Link>
            <button type="button" onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-white hover:text-blue-100 p-2">
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 - Category Navigation - hidden on mobile */}
      <div className="hidden md:block border-t border-blue-700 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {categories.map((category) => {
              const isHovered = hoveredCategoryId === category.id
              return (
                <div
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link
                    to={`/products?category=${category.id}`}
                    className={`text-sm font-medium transition-colors ${
                      isActive(`/products?category=${category.id}`) || isHovered
                        ? 'text-white bg-blue-700 font-semibold px-2 py-1 rounded'
                        : 'text-white hover:text-blue-100'
                    }`}
                  >
                    {category.name}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
        {/* Category-specific mega menu - positioned below row 2 */}
        {hoveredCategoryId && (() => {
          const hoveredCategory = categories.find(cat => cat.id === hoveredCategoryId)
          if (!hoveredCategory) return null
          const subcategories = hoveredCategory.subcategories || []
          const subcategoryCount = subcategories.length
          /**
           * Calculate CTA position based on subcategory count
           * Each row holds up to 4 subcategories, CTA takes remaining columns in that row
           * @author Thang Truong
           * @date 2025-01-28
           */
          let ctaRow, ctaColSpan, ctaColStart
          if (subcategoryCount === 0) {
            // 0 subcats: CTA takes all 4 columns in row 1
            ctaRow = 1
            ctaColSpan = 4
            ctaColStart = 1
          } else if (subcategoryCount <= 3) {
            // 1-3 subcats: CTA in row 1, takes remaining columns
            ctaRow = 1
            ctaColSpan = 4 - subcategoryCount
            ctaColStart = subcategoryCount + 1
          } else {
            // 4+ subcats: Calculate full rows and remaining subcats in last row
            const fullRows = Math.floor(subcategoryCount / 4)
            const remainingInLastRow = subcategoryCount % 4
            if (remainingInLastRow === 0) {
              // Last row is full (4 subcats), CTA goes to next row with all 4 columns
              ctaRow = fullRows + 1
              ctaColSpan = 4
              ctaColStart = 1
            } else {
              // CTA fits in same row as last subcats, takes remaining columns
              ctaRow = fullRows + 1
              ctaColSpan = 4 - remainingInLastRow
              ctaColStart = remainingInLastRow + 1
            }
          }
          return (
            <div className="fixed left-0 right-0 bg-white shadow-2xl border-t border-gray-100 z-40" style={{ top: `${megaMenuTop}px` }} onMouseEnter={() => handleCategoryHover(hoveredCategoryId)} onMouseLeave={handleCategoryLeave}>
              <div className="w-full">
                {/* Category mega menu content */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                  {/* CSS Grid: 4 columns per row, subcategories first, CTA takes remaining columns in appropriate row */}
                  <div className="grid md:grid-cols-4 gap-6 auto-rows-min">
                    {/* Subcategories - rendered first, each row holds up to 4 subcategories */}
                    {subcategories.map((sub) => {
                      const childCategories = Array.isArray(sub.child_categories) ? sub.child_categories : []
                      return (
                        <div key={sub.id} className="space-y-3">
                          <Link to={`/products?category=${hoveredCategory.id}&subcategory=${sub.id}`} className="block text-base font-semibold text-gray-900 hover:text-blue-700">
                            {sub.name}
                          </Link>
                          <div className="space-y-2">
                            {/* Child categories - displayed as clickable links */}
                            {childCategories.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {childCategories.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/products?category=${hoveredCategory.id}&subcategory=${sub.id}&childCategory=${child.id}`}
                                    className="text-xs text-gray-800 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {/* Clearance Sale CTA - takes remaining columns in appropriate row based on subcategory count */}
                    <div 
                      style={{ 
                        gridRow: ctaRow,
                        gridColumn: `${ctaColStart} / span ${ctaColSpan}`
                      }}
                    >
                      <Link
                        to={`/clearance?category=${hoveredCategory.id}&categoryName=${encodeURIComponent(hoveredCategory.name)}`}
                        className="block relative h-full min-h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-red-500 to-red-600 hover:opacity-90 transition-opacity group"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                        <div className="relative h-full p-6 flex flex-col justify-between text-white">
                          <div>
                            <FaTag className="text-3xl mb-2" />
                            <h4 className="text-2xl font-bold mb-2">{hoveredCategory.name} Clearance</h4>
                            <p className="text-sm opacity-90">Explore exclusive deals on {hoveredCategory.name.toLowerCase()} items</p>
                          </div>
                          <span className="text-sm font-semibold underline">Shop Now →</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 top-16" onClick={closeMobileMenu}>
          <div ref={mobileMenuRef} className="bg-white shadow-xl h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={closeMobileMenu} className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors ${isActive('/', true) ? 'text-blue-600 bg-blue-50 px-2 rounded font-semibold' : 'text-gray-900 hover:text-gray-800'}`}><FaHome /> <span>Home</span></Link>
              <div className="border-t border-gray-200 pt-4">
                <button type="button" onClick={() => setIsMegaOpen(!isMegaOpen)} className={`w-full flex items-center justify-between py-2 text-base font-medium transition-colors ${isActive('/products') ? 'text-blue-600 bg-blue-50 px-2 rounded font-semibold' : 'text-gray-900 hover:text-gray-800'}`}>
                  <span className="flex items-center space-x-2"><FaBoxOpen /> <span>Products</span></span> <span className="text-xs">{isMegaOpen ? '▲' : '▼'}</span>
                </button>
                <button type="button" onClick={openFilterDrawer} className="w-full text-left py-2 text-base font-medium text-gray-900 hover:text-gray-800 flex items-center space-x-2"><FaSearch /> <span>Filters</span></button>
                {isMegaOpen && (
                  <div className="pl-4 mt-2 space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <Link to={`/products?category=${category.id}`} onClick={closeMobileMenu} className="block text-sm font-semibold text-gray-900">{category.name}</Link>
                        {(category.subcategories || []).map((sub) => {
                          // Ensure child_categories is an array
                          const childCategories = Array.isArray(sub.child_categories) ? sub.child_categories : []
                          return (
                            <div key={sub.id} className="pl-2">
                              <Link to={`/products?category=${category.id}&subcategory=${sub.id}`} onClick={closeMobileMenu} className="block text-sm text-gray-800 mb-1">{sub.name}</Link>
                              {/* Child categories - displayed as clickable links */}
                              {childCategories.length > 0 && (
                                <div className="pl-2 flex flex-wrap gap-2 mt-1">
                                  {childCategories.map((child) => (
                                    <Link 
                                      key={child.id} 
                                      to={`/products?category=${category.id}&subcategory=${sub.id}&childCategory=${child.id}`} 
                                      onClick={closeMobileMenu} 
                                      className="text-xs text-gray-800 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition-colors"
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/clearance" onClick={closeMobileMenu} className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors ${isActive('/clearance') ? 'text-red-900 bg-red-200 px-2 rounded font-bold' : 'text-red-800 hover:text-red-900'}`}><FaTag /> <span>Clearance</span></Link>
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="px-2 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {menuItems.map((item) => (
                    <Link key={item.to} to={item.to} onClick={closeMobileMenu} className={`flex items-center space-x-2 px-2 py-2 transition-colors ${isActive(item.to) ? 'bg-yellow-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><item.icon className={isActive(item.to) ? 'text-yellow-900' : 'text-gray-400'} /> <span>{item.label}</span></Link>
                  ))}
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={closeMobileMenu} className={`flex items-center space-x-2 px-2 py-2 transition-colors ${isActive('/admin') ? 'bg-yellow-100 text-gray-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><FaCog className={isActive('/admin') ? 'text-yellow-900' : 'text-gray-400'} /> <span>Admin Dashboard</span></Link>
                  )}
                  <button onClick={() => { closeMobileMenu(); handleLogout(); }} className="w-full flex items-center space-x-2 px-2 py-2 text-red-600 hover:bg-red-50"><FaSignOutAlt className="text-red-400" /> <span>Logout</span></button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <Link to="/login" onClick={closeMobileMenu} className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors ${isActive('/login') ? 'text-gray-900 bg-yellow-100 px-2 rounded font-semibold' : 'text-gray-900 hover:text-gray-800'}`}><FaSignInAlt /> <span>Login</span></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
