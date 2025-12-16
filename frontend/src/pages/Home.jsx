/**
 * Home Page Component
 * Landing page with featured content, products, and categories
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaShippingFast, FaShieldAlt, FaUndo, FaArrowRight, FaTag } from 'react-icons/fa'
import ProductCard from '../components/ProductCard'
import SkeletonLoader from '../components/SkeletonLoader'
import RecentlyViewed from '../components/RecentlyViewed'
import Recommendations from '../components/Recommendations'
import CategoryCarousel from '../components/CategoryCarousel'
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
  const [loading, setLoading] = useState(true)

  /**
   * Fetch featured products and categories
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, clearanceRes, categoriesData] = await Promise.all([
          axios.get('/api/products?limit=10&sortBy=created_at&sortOrder=DESC'),
          axios.get('/api/products/clearance?limit=4'),
          loadCategories()
        ])
        setFeaturedProducts(productsRes.data.products || [])
        setClearanceProducts(clearanceRes.data.products || [])
        setCategories(categoriesData || [])
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

  /* Home page layout */
  return (
    <div className="min-h-screen">
      {/* Hero banner section with features */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero content */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold mb-6">Welcome to Ecommerce Store</h1>
            <p className="text-xl mb-8 text-blue-100">Discover amazing products at unbeatable prices. Quality you can trust, delivered to your door.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                Shop Now
              </Link>
              <Link to="/clearance" className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition">
                View Clearance
              </Link>
            </div>
          </div>

          {/* Features section */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-6 border-t border-blue-400/20">
            <div className="flex items-center gap-2">
              <FaShippingFast className="text-white text-sm" />
              <span className="text-sm text-blue-100">Free Shipping over $100</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-white text-sm" />
              <span className="text-sm text-blue-100">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUndo className="text-white text-sm" />
              <span className="text-sm text-blue-100">Easy Returns</span>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        <RecentlyViewed limit={1000} onAddToCart={handleAddToCart} />

        {/* Recommendations section */}
        <Recommendations limit={1000} onAddToCart={handleAddToCart} />
      </div>
    </div>
  )
}

export default Home
