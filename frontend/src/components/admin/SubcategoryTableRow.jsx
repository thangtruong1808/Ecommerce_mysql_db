/**
 * Subcategory Table Row Component
 * Table row for subcategory management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaEdit, FaTrash } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'
import { formatDate } from '../../utils/dateUtils'

/**
 * SubcategoryTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.subcategory - Subcategory object
 * @param {number} props.index - Sequential index number
 * @param {boolean} props.isSelected - Whether subcategory is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Subcategory table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const SubcategoryTableRow = ({ subcategory, index, isSelected, onToggle, onEdit, onDelete }) => {
  /* Subcategory table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={subcategory.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subcategory.id}</td>
      <td className="px-6 py-4">
        {subcategory.photo_url ? (
          <img
            src={subcategory.photo_url.startsWith('http') ? subcategory.photo_url : `${window.location.origin}${subcategory.photo_url}`}
            alt={subcategory.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No photo
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{subcategory.name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{subcategory.category_name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subcategory.category_id}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {subcategory.description || <span className="text-gray-400">No description</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(subcategory.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(subcategory.updated_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="Edit subcategory"
          >
            <FaEdit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete subcategory"
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default SubcategoryTableRow
