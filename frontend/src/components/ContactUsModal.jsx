/**
 * Contact Us Modal Component
 * Modal displaying contact information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { Button } from './ui'

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="w-full max-w-md rounded-ui-lg border border-line bg-surface p-6 text-ink shadow-ui">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-ui text-xl font-semibold text-ink">Contact Us</h2>
          <button type="button" onClick={onClose} className="rounded-ui text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-muted">We're here to help! Reach out to us through any of the following channels:</p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FaEnvelope className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Email</p>
                <a href="mailto:thangtruong1808@gmail.com" className="font-ui text-primary hover:text-primary-hover hover:underline">thangtruong1808@gmail.com</a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaPhone className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Phone</p>
                <a href="tel:0466828649" className="font-ui text-primary hover:text-primary-hover hover:underline">0466828649</a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Address</p>
                <p className="text-muted">123 Main Street<br />Melbourne Victoria 3000<br />Australia</p>
              </div>
            </div>
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-sm text-muted">We typically respond within 24 hours during business days.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

export default ContactUsModal
