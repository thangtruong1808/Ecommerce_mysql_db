/**
 * Inline Edit Cell Component
 * Editable table cell with auto-save functionality
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useEffect, useRef } from 'react'

/**
 * InlineEditCell component
 * @param {Object} props - Component props
 * @param {string|number} props.value - Current value
 * @param {string} props.type - Input type (text, number, select)
 * @param {Array} props.options - Options for select type
 * @param {Function} props.onSave - Save callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element} Inline edit cell component
 */
const InlineEditCell = ({ 
  value, 
  type = 'text', 
  options = [], 
  onSave, 
  onCancel,
  loading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef(null)

  /**
   * Initialize edit value when value changes
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    setEditValue(value)
  }, [value])

  /**
   * Focus input when editing starts
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (type === 'text') {
        inputRef.current.select()
      }
    }
  }, [isEditing, type])

  /**
   * Handle save
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSave = () => {
    if (editValue !== value && onSave) {
      onSave(editValue)
    }
    setIsEditing(false)
  }

  /**
   * Handle cancel
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
    if (onCancel) {
      onCancel()
    }
  }

  /**
   * Handle key down
   * @param {Object} e - Event object
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (!isEditing) {
    /* Display mode */
    return (
      <div
        onClick={() => !loading && setIsEditing(true)}
        className={`cursor-pointer hover:bg-gray-50 px-2 py-1 rounded ${loading ? 'opacity-50' : ''}`}
      >
        {type === 'number' ? (typeof value === 'number' ? value.toFixed(2) : value) : value}
      </div>
    )
  }

  /* Edit mode */
  return (
    <div className="inline-block">
      {type === 'select' ? (
        <select
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-24"
        />
      )}
    </div>
  )
}

export default InlineEditCell
