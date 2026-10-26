/**
 * FAQ Modal Component
 * Modal displaying frequently asked questions
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaQuestionCircle } from 'react-icons/fa'
import { Button } from './ui'

/**
 * FAQModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} FAQ modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const FAQModal = ({ isOpen, onClose }) => {
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

  /* FAQ items */
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You can create an account or checkout as a guest.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and other secure payment methods through our payment gateway.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. We are working on integrating real-time tracking on our website.'
    },
    {
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 24 hours of placing it. After that, please contact our customer service team.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within Australia. We are exploring international shipping options for the future.'
    }
  ]

  /* FAQ modal */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-ui-lg border border-line bg-surface p-6 text-ink shadow-ui">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center font-ui text-xl font-semibold text-ink">
            <FaQuestionCircle className="mr-2 text-primary" />
            Frequently Asked Questions
          </h2>
          <button type="button" onClick={onClose} className="rounded-ui text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-muted">Find answers to common questions about shopping with us:</p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-line pb-4 last:border-0">
                <h3 className="mb-2 font-ui font-semibold text-ink">{faq.question}</h3>
                <p className="text-sm text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-4">
            <p className="text-sm text-muted">Still have questions? Feel free to contact our customer service team for assistance.</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

export default FAQModal
