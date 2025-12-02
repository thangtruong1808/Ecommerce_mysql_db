/**
 * 404 Not Found Page Component
 * Displays when a route is not found
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { Link } from 'react-router-dom'
import { FaHome, FaShoppingBag } from 'react-icons/fa'
import Button from '../components/Button'

/**
 * NotFound component
 * @returns {JSX.Element} 404 page
 */
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* 404 content container */}
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Navigation buttons */}
        <div className="flex justify-center space-x-4">
          <Link to="/">
            <Button icon="home">
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button icon="search" variant="secondary">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound

