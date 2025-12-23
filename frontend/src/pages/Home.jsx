/**
 * Home Page Component
 * Landing page with featured content, products, and categories
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaShippingFast, FaShieldAlt, FaUndo, FaArrowRight, FaTag } from 'react-icons/fa'
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader'
import RecentlyViewed from '../components/RecentlyViewed'
import Recommendations from '../components/Recommendations'
import CategoryCarousel from '../components/CategoryCarousel'
import VoucherSection from '../components/VoucherSection'
import VoucherCodeItem from '../components/VoucherCodeItem'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { loadCategories } from '../utils/categoryCache'

/**
 * Home component
 * @returns {JSX.Element} Home page
 * @author Thang Truong
 * @date 2025-12-12
 */
const Home = () => {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [clearanceProducts, setClearanceProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedCodes, setCopiedCodes] = useState(new Set())

  /**
   * Fetch featured products, categories, and vouchers
   * @author Thang Truong
   * @date 2025-12-17
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, clearanceRes, categoriesData, vouchersRes] = await Promise.all([
          axios.get('/api/products?limit=10&sortBy=created_at&sortOrder=DESC'),
          axios.get('/api/products/clearance?limit=4'),
          loadCategories(),
          axios.get('/api/vouchers').catch(() => ({ data: [] }))
        ])
        setFeaturedProducts(productsRes.data.products || [])
        setClearanceProducts(clearanceRes.data.products || [])
        setCategories(categoriesData || [])
        setVouchers(vouchersRes.data || [])
      } catch (error) {
        // Silent fail for home page
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  /**
   * Handle add to cart
   * @param {Object} product - Product object
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    await addToCart(product.id, 1)
  }

  /**
   * Handle copy voucher code to clipboard
   * @param {string} code - Voucher code to copy
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodes(prev => new Set(prev).add(code))
      toast.success(`Voucher code ${code} copied!`)
      setTimeout(() => {
        setCopiedCodes(prev => {
          const newSet = new Set(prev)
          newSet.delete(code)
          return newSet
        })
      }, 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  /* Home page layout */
  return (
    <div className="min-h-screen">
      {/* Hero banner section with features */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white py-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero content */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold mb-6">Welcome to Ecommerce Store</h1>
            <p className="text-xl mb-8 text-blue-100">Discover amazing products at unbeatable prices and amazing discounts with our exclusive voucher codes!</p>
          </div>

          {/* Voucher codes section - centered in hero banner */}
          {vouchers.length > 0 && (
            <div className="text-center">
              <div className="max-w-full mx-auto">
                <div className="flex flex-wrap justify-center items-center gap-3">
                  {vouchers.slice(0, 4).map((voucher, index) => (
                    <VoucherCodeItem
                      key={voucher.id}
                      voucher={voucher}
                      isCopied={copiedCodes.has(voucher.code)}
                      onCopy={handleCopyCode}
                      showHeader={index === 0}
                    />
                  ))}
                </div>
                {vouchers.length > 4 && (
                  <p className="text-sm text-blue-100 mt-3">+{vouchers.length - 4} more voucher{vouchers.length - 4 !== 1 ? 's' : ''} available</p>
                )}
              </div>
            </div>
          )}

          {/* Features section */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-6 border-t border-blue-400/20">
            <div className="flex items-center gap-2">
              <FaShippingFast className="text-white text-sm" />
              <span className="text-sm text-blue-100">Free Shipping over $100 </span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-white text-sm" />
              <span className="text-sm text-blue-100">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUndo className="text-white text-sm" />
              <span className="text-sm text-blue-100">Easy Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <FaTag className="text-white text-sm" />
              <span className="text-sm text-blue-100">Exclusive Vouchers & Discounts</span>
            </div>
          </div>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Categories section */}
        {categories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            {loading ? (
              <SkeletonLoader type="card" count={1} />
            ) : (
              <CategoryCarousel categories={categories} />
            )}
          </section>
        )}

        {/* Clearance deals section */}
        {clearanceProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FaTag className="text-red-500 text-2xl" />
                <h2 className="text-3xl font-bold text-gray-900">Clearance Deals</h2>
              </div>
              <Link to="/clearance" className="text-blue-600 hover:text-blue-800 flex items-center">
                View All <FaArrowRight className="ml-2" />
              </Link>
            </div>
            {loading ? (
              <SkeletonLoader type="card" count={4} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {clearanceProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Featured products section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
              View All <FaArrowRight className="ml-2" />
            </Link>
          </div>
          {loading ? (
            <SkeletonLoader type="card" count={10} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>
        {/* Divider */}
        <div className="my-12">
          <hr />
        </div>
        {/* Recently viewed section */}
        <RecentlyViewed onAddToCart={handleAddToCart} />

        {/* Recommendations section */}
        <Recommendations onAddToCart={handleAddToCart} />
      </div>
    </div>
  )
}

export default Home
