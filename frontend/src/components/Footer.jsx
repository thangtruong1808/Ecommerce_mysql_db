/**
 * Footer Component
 * Site footer with links and information
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import logoImage from '../assets/images/Logo.png'

/**
 * Footer component
 * @returns {JSX.Element} Footer component
 */
const Footer = () => {
  /* Footer component layout */
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Footer container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info with logo matching navbar */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 hover:opacity-80 transition-opacity">
              <img 
                src={logoImage} 
                alt="Ecommerce Store Logo" 
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">Ecommerce Store</span>
                <span className="text-xs text-gray-400">Your trusted shopping destination</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mt-2">
              Quality products, exceptional service, and secure shopping experience.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-white">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Contact Us</li>
              <li>Shipping Info</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>ABN: 12 345 678 901</li>
              <li>123 Main Street</li>
              <li>Melbourne Victoria 3000, Australia</li>
              <li>Email: thangtruong1808@gmail.com</li>
              <li>Phone: +61 2 9876 5432</li>
            </ul>
          </div>
        </div>

        {/* Footer message */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>This ecommerce platform was thoughtfully designed and developed by Thang Truong. Thank you for shopping with us!</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

