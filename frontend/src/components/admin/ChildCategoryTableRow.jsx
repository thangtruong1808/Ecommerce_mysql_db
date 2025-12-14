/**
 * Child Category Table Row Component
 * Table row for child category management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { FaEdit, FaTrash } from 'react-icons/fa'
import BulkSelectCheckbox from './BulkSelectCheckbox'
import { formatDate } from '../../utils/dateUtils'

/**
 * ChildCategoryTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.childCategory - Child category object
 * @param {number} props.index - Sequential index number
 * @param {boolean} props.isSelected - Whether child category is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Child category table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ChildCategoryTableRow = ({ childCategory, index, isSelected, onToggle, onEdit, onDelete }) => {
  /* Child category table row */
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <BulkSelectCheckbox
          itemId={childCategory.id}
          isSelected={isSelected}
          onToggle={onToggle}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{childCategory.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{childCategory.name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{childCategory.category_name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{childCategory.subcategory_name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{childCategory.subcategory_id}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {childCategory.description || <span className="text-gray-400">No description</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(childCategory.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(childCategory.updated_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            aria-label="Edit child category"
          >
            <FaEdit className="w-3 h-3" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete child category"
          >
            <FaTrash className="w-3 h-3" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ChildCategoryTableRow
