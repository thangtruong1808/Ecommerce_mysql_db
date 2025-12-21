/**
 * Shipping Info Modal Component
 * Modal displaying shipping information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaTruck, FaClock, FaShieldAlt } from 'react-icons/fa'

/**
 * ShippingInfoModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Shipping info modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const ShippingInfoModal = ({ isOpen, onClose }) => {
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

  /* Shipping info modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* Modal container */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600">We offer fast and reliable shipping to get your orders to you quickly and safely.</p>
          {/* Shipping details */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FaTruck className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Delivery Time</p>
                <p className="text-gray-600">Your order will be delivered within <strong>3-5 business days</strong> from the date of shipment.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaClock className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Processing Time</p>
                <p className="text-gray-600">Orders are typically processed within 1-2 business days after payment confirmation.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaShieldAlt className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Tracking</p>
                <p className="text-gray-600">We will integrate shipping tracking with our provider soon. You'll receive tracking information via email once your order ships.</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">For any shipping inquiries, please contact our customer service team.</p>
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

export default ShippingInfoModal
