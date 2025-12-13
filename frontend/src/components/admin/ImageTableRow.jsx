/**
 * Image Table Row Component
 * Table row for image management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { Link } from 'react-router-dom'
import { FaTrash, FaStar, FaEye } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'

/**
 * ImageTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.image - Image object
 * @param {boolean} props.isSelected - Whether image is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onView - View callback
 * @param {Function} props.onSetPrimary - Set primary callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Image table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ImageTableRow = ({ image, isSelected, onToggle, onView, onSetPrimary, onDelete }) => {
  /**
   * Get image URL
   * @param {string} url - Image URL
   * @returns {string} Full image URL
   * @author Thang Truong
   * @date 2025-12-12
   */
  const getImageUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    return `${window.location.origin}${url}`
  }

  /* Image table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={image.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{image.id}</td>
      <td className="px-6 py-4">
        <img
          src={getImageUrl(image.image_url)}
          alt={`Image ${image.id}`}
          className="h-16 w-16 object-cover rounded cursor-pointer"
          onClick={onView}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Link
          to={`/admin/products/${image.product_id}/edit`}
          className="text-blue-600 hover:text-blue-800"
        >
          {image.product_name || `Product #${image.product_id}`}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {image.is_primary ? (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-500 text-white px-2 py-1 rounded">
            <FaStar className="text-xs" />
            Primary
          </span>
        ) : (
          <button
            onClick={() => onSetPrimary(image.id)}
            className="text-gray-400 hover:text-yellow-600"
            aria-label="Set as primary"
          >
            <FaStar />
          </button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(image.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800"
            aria-label="View image"
          >
            <FaEye />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete image"
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ImageTableRow
