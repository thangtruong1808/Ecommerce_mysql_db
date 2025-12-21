/**
 * Returns Modal Component
 * Modal displaying return policy information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaUndo, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'

/**
 * ReturnsModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Returns modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const ReturnsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  /**
   * Handle overlay click to close modal
   * @param {Event} e - Click event
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  /* Returns modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* Modal container */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Returns Policy</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600">We want you to be completely satisfied with your purchase. Here's our returns policy:</p>
          {/* Return details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Return Window</p>
                <p className="text-gray-600">You have <strong>30 days</strong> from the date of delivery to return items in their original condition.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Return Conditions</p>
                <p className="text-gray-600">Items must be unused, in original packaging, and include all tags and accessories.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaUndo className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">How to Return</p>
                <p className="text-gray-600">Contact our customer service team to initiate a return. We'll provide you with a return authorization and shipping instructions.</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Refunds will be processed to your original payment method within 5-10 business days after we receive your return.</p>
          </div>
        </div>
        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReturnsModal
