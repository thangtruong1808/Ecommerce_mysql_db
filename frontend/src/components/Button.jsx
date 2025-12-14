/**
 * Button Component
 * Reusable button component with loading state and icons
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { FaSpinner } from 'react-icons/fa'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaShoppingCart, FaSignInAlt, FaUserPlus, FaSave, FaTimes, FaCheck, FaHome, FaKey } from 'react-icons/fa'

/**
 * Get icon component by name
 * @param {string} iconName - Icon name
 * @returns {ReactNode} Icon component
 */
const getIcon = (iconName) => {
  const icons = {
    add: <FaPlus />,
    edit: <FaEdit />,
    delete: <FaTrash />,
    search: <FaSearch />,
    cart: <FaShoppingCart />,
    login: <FaSignInAlt />,
    register: <FaUserPlus />,
    save: <FaSave />,
    cancel: <FaTimes />,
    check: <FaCheck />,
    home: <FaHome />,
    reset: <FaKey />,
  }
  return icons[iconName] || null
}

/**
 * Button component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'danger', 'outline')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.loading - Loading state
 * @param {string|ReactNode} props.icon - Icon name or icon component
 * @param {string} props.type - Button type
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Button component
 * @author Thang Truong
 * @date 2025-12-12
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
}) => {
  /**
   * Get button variant classes
   * @returns {string} CSS classes
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100'
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
    }
  }

  /**
   * Get button size classes
   * @returns {string} CSS classes
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-sm'
      case 'md':
        return 'px-4 py-2'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2'
    }
  }

  return (
    /* Button element */
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getSizeClasses()} rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${getVariantClasses()} ${className}`}
    >
      {/* Button content */}
      {loading ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{typeof icon === 'string' ? getIcon(icon) : icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

export default Button

