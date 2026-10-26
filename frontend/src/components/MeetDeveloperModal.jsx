/**
 * Meet Developer Modal Component
 * Modal displaying information about the developer
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaEnvelope } from 'react-icons/fa'
import developerPhoto from '../assets/images/TT-Avatar.jpg'
import { Button } from './ui'

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-ui-lg border border-line bg-surface p-6 text-ink shadow-ui">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-ui text-xl font-semibold text-ink">Meet the Developer</h2>
          <button type="button" onClick={onClose} className="rounded-ui text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <img
              src={developerPhoto}
              alt="Thang Truong - Developer"
              className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-primary/20 object-cover"
            />
            <h3 className="mb-2 font-ui text-xl font-semibold text-ink">Thang Truong</h3>
            <p className="font-ui font-medium text-primary">Full Stack Developer</p>
          </div>
          <div className="space-y-3">
            <p className="text-center text-muted">
              Hello! I'm Thang Truong, the developer behind this ecommerce platform. I'm passionate about creating
              user-friendly, secure, and efficient web applications that provide exceptional shopping experiences.
            </p>
            <div className="space-y-2 rounded-ui bg-surface-muted p-4">
              <p className="font-ui font-semibold text-ink">About This Project</p>
              <p className="text-sm text-muted">
                This ecommerce platform was thoughtfully designed and developed from the ground up, focusing on
                modern web technologies, best practices, and user experience. Every feature has been carefully
                crafted to ensure reliability and ease of use.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="flex-shrink-0 text-primary" />
                <a href="mailto:thangtruong1808@gmail.com" className="font-ui text-sm text-primary hover:text-primary-hover hover:underline">
                  thangtruong1808@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-center text-sm text-muted">
              Thank you for using this platform! I'm always open to feedback and suggestions for improvement.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

export default MeetDeveloperModal
