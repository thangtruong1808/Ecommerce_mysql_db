/**
 * Navigation Bar Component - Responsive navbar with mobile menu
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import logoImage from '../assets/images/Logo.png'
import { FaUserCircle, FaSignOutAlt, FaShoppingBag, FaFileInvoice, FaUser, FaCog, FaBars, FaTimes, FaSearch, FaHome, FaBoxOpen, FaTag, FaShoppingCart, FaSignInAlt, FaLaptop, FaMobile, FaTshirt, FaGamepad, FaTools, FaBook, FaMusic, FaCamera, FaCar, FaBicycle, FaStar, FaHiking } from 'react-icons/fa'
import { MdSportsTennis } from 'react-icons/md'
import { loadCategories } from '../utils/categoryCache'

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const closeTimerRef = useRef(null)
  const userMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)

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
   * @author Thang Truong
   * @date 2025-12-12
   */
  const fetchCategories = async () => {
    if (isLoadingCategories || categories.length) return
    try {
      setIsLoadingCategories(true)
      const data = await loadCategories()
      setCategories(data || [])
    } catch {} finally { setIsLoadingCategories(false) }
  }

  /**
   * Open mega menu (clears pending close)
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleOpenMega = () => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null }
    setIsMegaOpen(true)
  }

  /**
   * Close mega menu with slight delay for pointer transitions
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
   * Get category icon and color based on category name
   * @param {string} categoryName - Category name
   * @returns {Object} Icon component and color class
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getCategoryStyle = (categoryName) => {
    const name = (categoryName || '').toLowerCase()
    const iconMap = {
      tech: <FaLaptop className="mr-2" />, computer: <FaLaptop className="mr-2" />, laptop: <FaLaptop className="mr-2" />, technology: <FaLaptop className="mr-2" />,
      phone: <FaMobile className="mr-2" />, mobile: <FaMobile className="mr-2" />, electronics: <FaMobile className="mr-2" />,
      cloth: <FaTshirt className="mr-2" />, fashion: <FaTshirt className="mr-2" />, apparel: <FaTshirt className="mr-2" />, clothing: <FaTshirt className="mr-2" />,
      game: <FaGamepad className="mr-2" />, gaming: <FaGamepad className="mr-2" />, sports: <FaGamepad className="mr-2" />,
      tool: <FaTools className="mr-2" />, hardware: <FaTools className="mr-2" />, home: <FaTools className="mr-2" />, garden: <FaTools className="mr-2" />,
      book: <FaBook className="mr-2" />, books: <FaBook className="mr-2" />, education: <FaBook className="mr-2" />,
      music: <FaMusic className="mr-2" />, audio: <FaMusic className="mr-2" />, entertainment: <FaMusic className="mr-2" />,
      camera: <FaCamera className="mr-2" />, photo: <FaCamera className="mr-2" />, photography: <FaCamera className="mr-2" />,
      car: <FaCar className="mr-2" />, auto: <FaCar className="mr-2" />, automotive: <FaCar className="mr-2" />,
      bike: <FaBicycle className="mr-2" />, bicycle: <FaBicycle className="mr-2" />, fitness: <FaBicycle className="mr-2" />,
      badminton: <MdSportsTennis className="mr-2" />,
      hiking: <FaHiking className="mr-2" />
    }
    const colorMap = {
      tech: 'text-blue-600', computer: 'text-blue-600', technology: 'text-blue-600',
      phone: 'text-green-600', mobile: 'text-green-600', electronics: 'text-green-600',
      cloth: 'text-pink-600', fashion: 'text-pink-600', clothing: 'text-pink-600', apparel: 'text-pink-600',
      game: 'text-purple-600', gaming: 'text-purple-600', sports: 'text-purple-600',
      tool: 'text-orange-600', hardware: 'text-orange-600', home: 'text-orange-600', garden: 'text-orange-600',
      book: 'text-indigo-600', books: 'text-indigo-600', education: 'text-indigo-600',
      music: 'text-yellow-600', audio: 'text-yellow-600', entertainment: 'text-yellow-600',
      camera: 'text-red-600', photo: 'text-red-600', photography: 'text-red-600',
      car: 'text-cyan-600', auto: 'text-cyan-600', automotive: 'text-cyan-600',
      bike: 'text-emerald-600', bicycle: 'text-emerald-600', fitness: 'text-emerald-600',
      badminton: 'text-blue-500',
      hiking: 'text-green-700'
    }
    const colors = ['text-blue-600', 'text-green-600', 'text-pink-600', 'text-purple-600', 'text-orange-600', 'text-indigo-600', 'text-yellow-600', 'text-red-600', 'text-cyan-600', 'text-emerald-600']
    for (const key in iconMap) if (name.includes(key)) return { icon: iconMap[key], color: colorMap[key] || colors[name.length % colors.length] }
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return { icon: <FaStar className="mr-2" />, color: colors[hash % colors.length] }
  }

  // Menu items configuration
  const menuItems = [
    { to: '/profile', icon: FaUser, label: 'Profile' },
    { to: '/orders', icon: FaShoppingBag, label: 'Orders' },
    { to: '/invoices', icon: FaFileInvoice, label: 'Invoices' },
  ]

  /* Navigation bar layout */
  return (
    <nav className="bg-white shadow-md">
      {/* Navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand with friendly description */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={logoImage} alt="Ecommerce Store Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">Ecommerce Store</span>
              <span className="text-xs text-gray-500 hidden sm:block">Your trusted shopping destination</span>
            </div>
          </Link>
          
          {/* Desktop navigation links - hidden on mobile */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/', true) ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
              <FaHome className="mr-1.5" /> Home
            </Link>
            {/* Products mega menu */}
            <div className="relative" onMouseEnter={handleOpenMega} onMouseLeave={handleCloseMega}>
              <button type="button" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/products') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                <FaBoxOpen className="mr-1.5" /> Products <span className="ml-1 text-xs text-gray-500">{isLoadingCategories ? '...' : '▼'}</span>
              </button>
              {isMegaOpen && (
                <div className="fixed left-0 right-0 top-16 bg-white shadow-2xl border-t border-gray-100 z-40" onMouseEnter={handleOpenMega} onMouseLeave={handleCloseMega}>
                  <div className="w-full">
                    {/* Categories grid with CTA */}
                    <div className="max-w-7xl mx-auto p-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        {categories.map((category) => {
                          const { icon, color } = getCategoryStyle(category.name)
                          return (
                          <div key={category.id} className="space-y-3">
                            <Link to={`/products?category=${category.id}`} className={`flex items-center text-base font-semibold ${color} hover:opacity-80 transition-opacity`}>
                              {icon}
                              <span>{category.name}</span>
                            </Link>
                            <div className="space-y-2">
                              {(category.subcategories || []).map((sub) => (
                                <div key={sub.id} className="space-y-1">
                                  <Link to={`/products?category=${category.id}&subcategory=${sub.id}`} className="block text-sm font-medium text-gray-800 hover:text-blue-600">{sub.name}</Link>
                                  <div className="flex flex-wrap gap-2">
                                    {(sub.child_categories || []).map((child) => (
                                      <Link key={child.id} to={`/products?category=${category.id}&subcategory=${sub.id}&childCategory=${child.id}`} className="text-xs text-gray-600 hover:text-blue-600 bg-gray-50 px-2 py-1 rounded">{child.name}</Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          )
                        })}
                        {/* Clearance Sale CTA section - takes remaining width in row */}
                        {(() => {
                          const totalCategories = categories.length
                          const colsPerRow = 4
                          const categoriesInLastRow = totalCategories % colsPerRow || colsPerRow
                          const ctaColSpan = categoriesInLastRow === colsPerRow ? colsPerRow : colsPerRow - categoriesInLastRow
                          const colSpanClass = ctaColSpan === 1 ? 'md:col-span-1' : ctaColSpan === 2 ? 'md:col-span-2' : ctaColSpan === 3 ? 'md:col-span-3' : 'md:col-span-4'
                          return (
                            <div className={colSpanClass}>
                              <Link 
                                to="/clearance" 
                                className="block relative h-full min-h-[200px] rounded-lg overflow-hidden bg-gradient-to-br from-red-500 to-red-600 hover:opacity-90 transition-opacity group"
                              >
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>
                                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                                  <div>
                                    <FaTag className="text-3xl mb-2" />
                                    <h4 className="text-2xl font-bold mb-2">Clearance Sale</h4>
                                    <p className="text-sm opacity-90">Check out our latest deals and discounts</p>
                                  </div>
                                  <span className="text-sm font-semibold underline">Shop Now →</span>
                                </div>
                              </Link>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button type="button" onClick={openFilterDrawer} aria-controls="product-filters-drawer" aria-expanded="false" aria-haspopup="dialog" className="px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors text-gray-600 hover:text-gray-900" aria-label="Open product filters">
              <FaSearch className="mr-1" /> <span className="text-md">Filters</span>
            </button>
            <Link to="/clearance" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/clearance') ? 'text-red-700 bg-red-50 font-bold' : 'text-red-600 hover:text-red-700 font-semibold'}`}>
              <FaTag className="mr-1.5" /> <span className="text-md">Clearance</span>
            </Link>
            <Link to="/cart" className={`px-3 py-2 rounded-md text-sm font-medium relative inline-flex items-center transition-colors ${isActive('/cart') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
              <FaShoppingCart className="mr-1.5" /> <span className="text-md">Cart</span>
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getItemCount()}</span>
              )}
            </Link>
            {/* User menu dropdown for authenticated users */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button type="button" onClick={toggleUserMenu} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <FaUserCircle className="text-xl" /> <span>{user?.name}</span> <span className="text-xs text-gray-500">{isUserMenuOpen ? '▲' : '▼'}</span>
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
              <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors ${isActive('/login') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                <FaSignInAlt className="mr-1.5" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu button and cart - visible on mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <Link to="/cart" className="text-gray-600 hover:text-gray-900 px-2 py-2 relative">
              <FaShoppingBag className="text-xl" />
              {getItemCount() > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getItemCount()}</span>}
            </Link>
            <button type="button" onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-gray-600 hover:text-gray-900 p-2">
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 top-16" onClick={closeMobileMenu}>
          <div ref={mobileMenuRef} className="bg-white shadow-xl h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={closeMobileMenu} className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors ${isActive('/', true) ? 'text-blue-600 bg-blue-50 px-2 rounded font-semibold' : 'text-gray-600 hover:text-gray-900'}`}><FaHome /> <span>Home</span></Link>
              <div className="border-t border-gray-200 pt-4">
                <button type="button" onClick={() => setIsMegaOpen(!isMegaOpen)} className={`w-full flex items-center justify-between py-2 text-base font-medium transition-colors ${isActive('/products') ? 'text-blue-600 bg-blue-50 px-2 rounded font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>
                  <span className="flex items-center space-x-2"><FaBoxOpen /> <span>Products</span></span> <span className="text-xs">{isMegaOpen ? '▲' : '▼'}</span>
                </button>
                <button type="button" onClick={openFilterDrawer} className="w-full text-left py-2 text-base font-medium text-gray-600 hover:text-gray-900 flex items-center space-x-2"><FaSearch /> <span>Filters</span></button>
                {isMegaOpen && (
                  <div className="pl-4 mt-2 space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <Link to={`/products?category=${category.id}`} onClick={closeMobileMenu} className="block text-sm font-semibold text-gray-800">{category.name}</Link>
                        {(category.subcategories || []).map((sub) => (
                          <div key={sub.id} className="pl-2">
                            <Link to={`/products?category=${category.id}&subcategory=${sub.id}`} onClick={closeMobileMenu} className="block text-sm text-gray-600 mb-1">{sub.name}</Link>
                            <div className="pl-2 flex flex-wrap gap-2">
                              {(sub.child_categories || []).map((child) => (
                                <Link key={child.id} to={`/products?category=${category.id}&subcategory=${sub.id}&childCategory=${child.id}`} onClick={closeMobileMenu} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">{child.name}</Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Link to="/clearance" onClick={closeMobileMenu} className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors ${isActive('/clearance') ? 'text-red-700 bg-red-50 px-2 rounded font-bold' : 'text-red-600 hover:text-red-700'}`}><FaTag /> <span>Clearance</span></Link>
              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="px-2 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {menuItems.map((item) => (
                    <Link key={item.to} to={item.to} onClick={closeMobileMenu} className={`flex items-center space-x-2 px-2 py-2 transition-colors ${isActive(item.to) ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><item.icon className={isActive(item.to) ? 'text-blue-500' : 'text-gray-400'} /> <span>{item.label}</span></Link>
                  ))}
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={closeMobileMenu} className={`flex items-center space-x-2 px-2 py-2 transition-colors ${isActive('/admin') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><FaCog className={isActive('/admin') ? 'text-blue-500' : 'text-gray-400'} /> <span>Admin Dashboard</span></Link>
                  )}
                  <button onClick={() => { closeMobileMenu(); handleLogout(); }} className="w-full flex items-center space-x-2 px-2 py-2 text-red-600 hover:bg-red-50"><FaSignOutAlt className="text-red-400" /> <span>Logout</span></button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <Link to="/login" onClick={closeMobileMenu} className={`flex items-center space-x-2 py-2 text-base font-medium transition-colors ${isActive('/login') ? 'text-blue-600 bg-blue-50 px-2 rounded font-semibold' : 'text-gray-600 hover:text-gray-900'}`}><FaSignInAlt /> <span>Login</span></Link>
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
