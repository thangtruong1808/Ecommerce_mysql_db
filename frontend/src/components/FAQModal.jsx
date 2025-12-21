/**
 * FAQ Modal Component
 * Modal displaying frequently asked questions
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

import { FaTimes, FaQuestionCircle } from 'react-icons/fa'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      {/* Modal container */}
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FaQuestionCircle className="mr-2 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close modal">
            <FaTimes className="text-xl" />
          </button>
        </div>
        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600">Find answers to common questions about shopping with us:</p>
          {/* FAQ list */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Still have questions? Feel free to contact our customer service team for assistance.</p>
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

export default FAQModal
