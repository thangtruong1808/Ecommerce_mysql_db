/**
 * Shipping Info Modal Component
 * Modal displaying shipping information
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaTruck, FaClock, FaShieldAlt } from 'react-icons/fa'
import { Button } from './ui'

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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-ui-lg border border-line bg-surface p-6 text-ink shadow-ui">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-ui text-xl font-semibold text-ink">Shipping Information</h2>
          <button type="button" onClick={onClose} className="rounded-ui text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-muted">We offer fast and reliable shipping to get your orders to you quickly and safely.</p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FaTruck className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Delivery Time</p>
                <p className="text-muted">Your order will be delivered within <strong>3-5 business days</strong> from the date of shipment.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaClock className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Processing Time</p>
                <p className="text-muted">Orders are typically processed within 1-2 business days after payment confirmation.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaShieldAlt className="mt-1 flex-shrink-0 text-primary" />
              <div>
                <p className="font-ui font-semibold text-ink">Tracking</p>
                <p className="text-muted">We will integrate shipping tracking with our provider soon. You'll receive tracking information via email once your order ships.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-sm text-muted">For any shipping inquiries, please contact our customer service team.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

export default ShippingInfoModal
