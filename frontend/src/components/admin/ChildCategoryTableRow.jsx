/**
 * Child Category Table Row Component
 * Table row for child category management
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import BulkSelectCheckbox from './BulkSelectCheckbox'

/**
 * ChildCategoryTableRow component
 * @param {Object} props - Component props
 * @param {Object} props.childCategory - Child category object
 * @param {boolean} props.isSelected - Whether child category is selected
 * @param {Function} props.onToggle - Toggle selection callback
 * @param {Function} props.onEdit - Edit callback
 * @param {Function} props.onDelete - Delete callback
 * @returns {JSX.Element} Child category table row component
 * @author Thang Truong
 * @date 2025-12-12
 */
const ChildCategoryTableRow = ({ childCategory, isSelected, onToggle, onEdit, onDelete }) => {
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
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{childCategory.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">{childCategory.name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{childCategory.category_name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{childCategory.subcategory_name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {childCategory.description || <span className="text-gray-400">No description</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(childCategory.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit child category"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete child category"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ChildCategoryTableRow
