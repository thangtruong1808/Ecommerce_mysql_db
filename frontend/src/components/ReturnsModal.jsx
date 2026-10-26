/**
 * Returns Modal Component
 * Modal displaying return policy information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaUndo, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'
import { Button } from './ui'

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-ui-lg border border-line bg-surface p-6 text-ink shadow-ui">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-ui text-xl font-semibold text-ink">Returns Policy</h2>
          <button type="button" onClick={onClose} className="rounded-ui text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-muted">We want you to be completely satisfied with your purchase. Here's our returns policy:</p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Return Window</p>
                <p className="text-muted">You have <strong>30 days</strong> from the date of delivery to return items in their original condition.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Return Conditions</p>
                <p className="text-muted">Items must be unused, in original packaging, and include all tags and accessories.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaUndo className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">How to Return</p>
                <p className="text-muted">Contact our customer service team to initiate a return. We'll provide you with a return authorization and shipping instructions.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-sm text-muted">Refunds will be processed to your original payment method within 5-10 business days after we receive your return.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

export default ReturnsModal
