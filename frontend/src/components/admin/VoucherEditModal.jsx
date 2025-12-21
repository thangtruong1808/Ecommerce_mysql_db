/**
 * Voucher Edit Modal Component
 * Modal for editing existing vouchers
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

/**
 * VoucherEditModal component
 * @param {Object} props - Component props
 * @param {Object} props.voucher - Voucher object
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Voucher edit modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherEditModal = ({ voucher, isOpen, onClose, onSave }) => {
  if (!isOpen || !voucher) return null

  /**
   * Format datetime-local input value from ISO string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted datetime-local value
   * @author Thang Truong
   * @date 2025-12-17
   */
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  /**
   * Handle form submit
   * @param {Event} e - Form event
   * @author Thang Truong
   * @date 2025-12-17
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      code: formData.get('code').toUpperCase().trim(),
      description: formData.get('description') || null,
      discount_type: formData.get('discount_type'),
      discount_value: parseFloat(formData.get('discount_value')),
      min_purchase_amount: parseFloat(formData.get('min_purchase_amount')) || 0,
      max_discount_amount: formData.get('max_discount_amount') ? parseFloat(formData.get('max_discount_amount')) : null,
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      usage_limit_per_user: parseInt(formData.get('usage_limit_per_user')) || 1,
      total_usage_limit: formData.get('total_usage_limit') ? parseInt(formData.get('total_usage_limit')) : null,
      is_active: formData.get('is_active') === 'on'
    }
    onSave(data)
  }

  /* Voucher edit modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Voucher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1">Code *</label>
            <input
              type="text"
              name="code"
              required
              maxLength={50}
              defaultValue={voucher.code}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded px-3 py-2"
              rows="3"
              defaultValue={voucher.description || ''}
            />
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type *</label>
              <select
                name="discount_type"
                required
                defaultValue={voucher.discount_type}
                className="w-full border rounded px-3 py-2"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Value *</label>
              <input
                type="number"
                name="discount_value"
                required
                min="0"
                step="0.01"
                defaultValue={voucher.discount_value}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Min Purchase and Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Purchase Amount</label>
              <input
                type="number"
                name="min_purchase_amount"
                min="0"
                step="0.01"
                defaultValue={voucher.min_purchase_amount || 0}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount (for %)</label>
              <input
                type="number"
                name="max_discount_amount"
                min="0"
                step="0.01"
                defaultValue={voucher.max_discount_amount || ''}
                className="w-full border rounded px-3 py-2"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                type="datetime-local"
                name="start_date"
                required
                defaultValue={formatDateTimeLocal(voucher.start_date)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                type="datetime-local"
                name="end_date"
                required
                defaultValue={formatDateTimeLocal(voucher.end_date)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Usage Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit Per User</label>
              <input
                type="number"
                name="usage_limit_per_user"
                min="1"
                defaultValue={voucher.usage_limit_per_user || 1}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Usage Limit</label>
              <input
                type="number"
                name="total_usage_limit"
                min="1"
                defaultValue={voucher.total_usage_limit || ''}
                className="w-full border rounded px-3 py-2"
                placeholder="Unlimited if empty"
              />
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={voucher.is_active}
                className="mr-2"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 justify-end pt-4">
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

export default VoucherEditModal
