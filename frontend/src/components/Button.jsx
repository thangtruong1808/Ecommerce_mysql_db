/**
 * Button Component
 * Reusable button component with loading state and icons
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { FaSpinner } from 'react-icons/fa'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaShoppingCart, FaSignInAlt, FaUserPlus, FaSave, FaTimes, FaCheck, FaHome } from 'react-icons/fa'

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
  }
  return icons[iconName] || null
}

/**
 * Button component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'danger')
 * @param {boolean} props.loading - Loading state
 * @param {string|ReactNode} props.icon - Icon name or icon component
 * @param {string} props.type - Button type
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Button component
 */
const Button = ({
  children,
  variant = 'primary',
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
   */
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100'
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400'
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${getVariantClasses()} ${className}`}
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

