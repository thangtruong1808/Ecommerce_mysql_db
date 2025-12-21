/**
 * Meet Developer Modal Component
 * Modal displaying information about the developer
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaEnvelope } from 'react-icons/fa'
import developerPhoto from '../assets/images/TT-Avatar.jpg'

/**
 * MeetDeveloperModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Meet developer modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const MeetDeveloperModal = ({ isOpen, onClose }) => {
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

  /* Meet developer modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* Modal container */}
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Meet the Developer</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        {/* Content */}
        <div className="space-y-4">
          <div className="text-center">
            {/* Developer photo */}
            <img 
              src={developerPhoto} 
              alt="Thang Truong - Developer" 
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thang Truong</h3>
            <p className="text-blue-600 font-medium">Full Stack Developer</p>
          </div>
          <div className="space-y-3">
            <p className="text-gray-600 text-center">
              Hello! I'm Thang Truong, the developer behind this ecommerce platform. I'm passionate about creating 
              user-friendly, secure, and efficient web applications that provide exceptional shopping experiences.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-gray-900">About This Project</p>
              <p className="text-sm text-gray-600">
                This ecommerce platform was thoughtfully designed and developed from the ground up, focusing on 
                modern web technologies, best practices, and user experience. Every feature has been carefully 
                crafted to ensure reliability and ease of use.
              </p>
            </div>
            {/* Contact information */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-600 flex-shrink-0" />
                <a href="mailto:thangtruong1808@gmail.com" className="text-blue-600 hover:underline text-sm">
                  thangtruong1808@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Thank you for using this platform! I'm always open to feedback and suggestions for improvement.
            </p>
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

export default MeetDeveloperModal
