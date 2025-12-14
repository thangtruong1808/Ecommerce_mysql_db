/**
 * Cart View Modal Component
 * Modal for viewing cart details
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

/**
 * CartViewModal component
 * @param {Object} props - Component props
 * @param {Object} props.cart - Cart object
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element} Cart view modal component
 * @author Thang Truong
 * @date 2025-12-12
 */
const CartViewModal = ({ cart, isOpen, onClose }) => {
  if (!isOpen || !cart) return null

  /**
   * Format currency
   * @param {number} amount - Amount
   * @returns {string} Formatted currency
   * @author Thang Truong
   * @date 2025-12-12
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  /* Cart view modal */
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Cart Details</h2>
        <div className="space-y-4 mb-4">
          <div>
            <span className="font-medium">Cart ID:</span> {cart.id}
          </div>
          <div>
            <span className="font-medium">User:</span>{' '}
            {cart.user_id ? (
              `${cart.user_name || cart.user_email || `User #${cart.user_id}`}`
            ) : (
              'Guest'
            )}
          </div>
          <div>
            <span className="font-medium">Items:</span> {cart.items?.length || 0}
          </div>
        </div>
        {cart.items && cart.items.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Cart Items</h3>
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(item.price)}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartViewModal
