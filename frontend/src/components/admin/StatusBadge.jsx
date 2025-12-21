/**
 * Status Badge Component
 * Clickable status badge with dropdown for status updates
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from 'react-icons/fa'

/**
 * StatusBadge component
 * @param {Object} props - Component props
 * @param {string} props.currentStatus - Current status value
 * @param {Array<string>} props.availableStatuses - Available status options
 * @param {Function} props.onStatusChange - Status change callback
 * @param {string} props.entityType - Entity type (order, product, user, voucher)
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element} Status badge component
 */
const StatusBadge = ({ 
  currentStatus, 
  availableStatuses = [], 
  onStatusChange, 
  entityType = 'order',
  loading = false 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  /**
   * Get status color - uses primary (Blue, Red) and secondary (Green, Gold) colors
   * @param {string} status - Status value
   * @returns {string} Tailwind color classes
   * @author Thang Truong
   * @date 2025-12-17
   */
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      paid: 'bg-green-100 text-green-800 border-green-300',
      delivered: 'bg-blue-100 text-blue-800 border-blue-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      active: 'bg-green-100 text-green-800 border-green-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  /**
   * Handle status selection
   * @param {string} newStatus - New status value
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleStatusSelect = (newStatus) => {
    if (newStatus !== currentStatus && onStatusChange) {
      onStatusChange(newStatus)
    }
    setIsOpen(false)
  }

  /**
   * Close dropdown when clicking outside
   * @author Thang Truong
   * @date 2025-12-12
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  /* Status badge with dropdown */
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded border ${getStatusColor(currentStatus)} ${
          loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
        }`}
      >
        <span className="capitalize">{currentStatus}</span>
        {!loading && availableStatuses.length > 1 && (
          <FaChevronDown className="ml-1 text-xs" />
        )}
      </button>

      {isOpen && availableStatuses.length > 1 && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px]">
          {availableStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusSelect(status)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                status === currentStatus ? 'bg-blue-50 font-semibold' : ''
              }`}
            >
              <span className="capitalize">{status}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatusBadge
