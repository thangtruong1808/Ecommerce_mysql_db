/**
 * Invoice Edit Modal Component
 * Modal for editing invoice
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * InvoiceEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.invoice - Invoice object
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Invoice edit modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const InvoiceEditModal = ({ invoice, isOpen, onClose, onSave }) => {
  if (!isOpen || !invoice) return null

  /**
   * Handle form submit
   * @param {Event} e - Form event
   * @author Thang Truong
   * @date 2025-12-12
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    onSave({
      payment_status: formData.get('payment_status'),
      email_sent: formData.get('email_sent') === 'true'
    })
  }

  /* Invoice edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <select
              name="payment_status"
              defaultValue={invoice.payment_status || 'pending'}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Sent</label>
            <select
              name="email_sent"
              defaultValue={invoice.email_sent ? 'true' : 'false'}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InvoiceEditModal
