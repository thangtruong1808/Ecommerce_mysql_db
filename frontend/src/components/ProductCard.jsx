/**
 * Product Card Component
 * Reusable product card for displaying products in listings
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import StarRating from "./StarRating";
import comingSoon from "../assets/images/image_comming_soon.png";

/**
 * ProductCard component
 * @param {Object} props - Component props
 * @param {Object} props.product - Product object
 * @param {Function} props.onAddToCart - Add to cart handler
 * @returns {JSX.Element} Product card component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ProductCard = ({ product, onAddToCart }) => {
  /**
   * Get primary image URL
   * @returns {string|null} Primary image URL or null
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getPrimaryImage = () => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find((img) => img.is_primary);
      return primary?.image_url || product.images[0]?.image_url || null;
    }
    return null;
  };

  const imageUrl = getPrimaryImage() || comingSoon;
  const likesCount =
    product.likes_count ??
    product.like_count ??
    product.total_likes ??
    product.num_likes ??
    0;
  const commentsCount =
    product.comments_count ??
    product.comment_count ??
    product.total_comments ??
    product.num_comments ??
    0;
  const reviewCount = product.num_reviews ?? 0;
  const rating = parseFloat(product.rating) || 0;

  return (
    /* Product card layout */
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-150 relative">
      {/* Discount badge */}
      {product.has_discount && product.discounted_price && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10 flex items-center space-x-1">
          <FaTag />
          <span>
            {product.discount_type === "percentage"
              ? `${Math.round(parseFloat(product.discount_value))}% OFF`
              : `$${parseFloat(product.discount_value).toFixed(2)} OFF`}
          </span>
        </div>
      )}

      {/* Product image */}
      <Link to={`/products/${product.id}`}>
        <div className="w-full aspect-square bg-white overflow-hidden flex items-center justify-center relative">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            // style={{ aspectRatio: '6 / 7' }}
            onError={(e) => {
              if (e.target.src !== comingSoon) e.target.src = comingSoon;
            }}
          />
        </div>
      </Link>

      {/* Product info */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm leading-5 hover:text-blue-600 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="text-right">
            {product.has_discount && product.discounted_price ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-blue-600">
                  ${(Number(product.discounted_price) || 0).toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${(Number(product.price) || 0).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-semibold text-blue-600">
                ${(Number(product.price) || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 ">
          <span className="flex items-center space-x-1">
            <StarRating rating={rating} numReviews={reviewCount} />
          </span>
          <span className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              👍 {likesCount}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              💬 {commentsCount}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
