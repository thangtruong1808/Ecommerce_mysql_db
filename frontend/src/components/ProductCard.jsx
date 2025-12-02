/**
 * Product Card Component
 * Reusable product card for displaying products in listings
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { Link } from 'react-router-dom'
import Button from './Button'
import { FaTag } from 'react-icons/fa'

/**
 * ProductCard component
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object
 * @param {Function} props.onAddToCart - Add to cart handler
 * @returns {JSX.Element} Product card component
 */
const ProductCard = ({ product, onAddToCart }) => {
  /**
   * Get primary image URL
   * @returns {string|null} Primary image URL or null
   */
  const getPrimaryImage = () => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find(img => img.is_primary)
      return primary?.image_url || product.images[0]?.image_url || null
    }
    return null
  }

  const imageUrl = getPrimaryImage()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
      {/* Discount badge */}
      {product.has_discount && product.discounted_price && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10 flex items-center space-x-1">
          <FaTag />
          <span>
            {product.discount_type === 'percentage'
              ? `${product.discount_value}% OFF`
              : `$${product.discount_value} OFF`}
          </span>
        </div>
      )}

      {/* Product image */}
      <Link to={`/products/${product.id}`}>
        <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-gray-500 text-sm">No image</p>
          )}
        </div>
      </Link>
      
      {/* Product info */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">
          {product.category_name} / {product.subcategory_name}
        </p>
        
        {/* Price with discount */}
        {product.has_discount && product.discounted_price ? (
          <div className="mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-blue-600">
                ${(Number(product.discounted_price) || 0).toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${(Number(product.price) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xl font-semibold text-blue-600 mb-2">
            ${(Number(product.price) || 0).toFixed(2)}
          </p>
        )}
        
        {product.rating > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            ★ {product.rating.toFixed(1)} ({product.num_reviews})
          </p>
        )}
        <Button
          onClick={() => onAddToCart(product.id)}
          icon="cart"
          className="w-full"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductCard

