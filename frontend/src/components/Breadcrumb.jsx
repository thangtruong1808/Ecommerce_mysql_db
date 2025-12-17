/**
 * Breadcrumb Component
 * Displays navigation breadcrumb with category hierarchy
 * @author Thang Truong
 * @date 2025-12-17
 */

import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaChevronRight } from 'react-icons/fa'

/**
 * Breadcrumb component
 * @param {Object} props - Component props
 * @param {string} props.categoryName - Category name
 * @param {string} props.subcategoryName - Subcategory name
 * @param {string} props.childCategoryName - Child category name
 * @param {number} props.categoryId - Category ID
 * @param {number} props.subcategoryId - Subcategory ID
 * @param {number} props.childCategoryId - Child category ID
 * @param {string} props.productName - Product name (optional, for product detail page)
 * @returns {JSX.Element} Breadcrumb component
 * @author Thang Truong
 * @date 2025-12-17
 */
const Breadcrumb = ({
  categoryName,
  subcategoryName,
  childCategoryName,
  categoryId,
  subcategoryId,
  childCategoryId,
  productName
}) => {
  const location = useLocation()
  const items = []

  // Home
  items.push({
    label: 'Home',
    path: '/',
    icon: <FaHome />
  })

  // Products page - show "Products" if no category is selected
  if (location.pathname === '/products' && !categoryName && !productName) {
    items.push({
      label: 'Products',
      path: '/products',
      isActive: true
    })
  }

  // Category
  if (categoryName && categoryId) {
    items.push({
      label: categoryName,
      path: `/products?category=${categoryId}`
    })
  }

  // Subcategory
  if (subcategoryName && subcategoryId) {
    items.push({
      label: subcategoryName,
      path: `/products?category=${categoryId}&subcategory=${subcategoryId}`
    })
  }

  // Child Category
  if (childCategoryName && childCategoryId) {
    items.push({
      label: childCategoryName,
      path: `/products?category=${categoryId}&subcategory=${subcategoryId}&childCategory=${childCategoryId}`
    })
  }

  // Product (for product detail page)
  if (productName) {
    items.push({
      label: productName,
      path: null,
      isActive: true
    })
  }

  // Don't show breadcrumb if only Home exists (except on products page)
  if (items.length <= 1 && location.pathname !== '/products') return null

  /* Breadcrumb navigation - displays hierarchical navigation path */
  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <FaChevronRight className="mx-2 text-gray-400" aria-hidden="true" />
            )}
            {item.path && !item.isActive ? (
              <Link
                to={item.path}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className={`flex items-center ${item.isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {item.icon && <span className="mr-1">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
