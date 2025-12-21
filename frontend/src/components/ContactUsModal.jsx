/**
 * Contact Us Modal Component
 * Modal displaying contact information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

/**
 * ContactUsModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Contact us modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const ContactUsModal = ({ isOpen, onClose }) => {
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

  /* Contact us modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* Modal container */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600">We're here to help! Reach out to us through any of the following channels:</p>
          {/* Contact information */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FaEnvelope className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Email</p>
                <a href="mailto:thangtruong1808@gmail.com" className="text-blue-600 hover:underline">thangtruong1808@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaPhone className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Phone</p>
                <a href="tel:+61298765432" className="text-blue-600 hover:underline">+61 2 9876 5432</a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Address</p>
                <p className="text-gray-600">123 Main Street<br />Melbourne Victoria 3000<br />Australia</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">We typically respond within 24 hours during business days.</p>
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

export default ContactUsModal
