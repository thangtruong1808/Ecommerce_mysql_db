/**
 * Voucher Create Modal Component
 * Modal for creating new vouchers
 * 
 * @author Thang Truong
 * @date 2025-12-17
 */

/**
 * VoucherCreateModal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @param {Function} props.onSave - Save callback (data)
 * @returns {JSX.Element} Voucher create modal component
 * @author Thang Truong
 * @date 2025-12-17
 */
const VoucherCreateModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null

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

  /* Voucher create modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create Voucher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1">Code *</label>
            <input
              type="text"
              name="code"
              required
              maxLength={50}
              className="w-full border rounded px-3 py-2"
              placeholder="VOUCHER123"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Voucher description..."
            />
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type *</label>
              <select
                name="discount_type"
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Select Type</option>
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
                className="w-full border rounded px-3 py-2"
                placeholder="10"
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
                defaultValue="0"
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
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                type="datetime-local"
                name="end_date"
                required
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
                defaultValue="1"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Usage Limit</label>
              <input
                type="number"
                name="total_usage_limit"
                min="1"
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
                defaultChecked
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VoucherCreateModal
