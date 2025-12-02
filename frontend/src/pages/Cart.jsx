/**
 * Cart Page Component
 * Displays shopping cart with items and checkout functionality
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

/**
 * Cart component
 * @returns {JSX.Element} Cart page
 */
const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getTotals, getItemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  /**
   * Handle quantity change
   * @param {number} itemId - Cart item ID
   * @param {number} newQuantity - New quantity
   */
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return
    }
    const result = await updateQuantity(itemId, newQuantity)
    if (result.success) {
      toast.success('Cart updated')
    } else {
      toast.error(result.error || 'Failed to update quantity')
    }
  }

  /**
   * Handle remove item
   * @param {number} itemId - Cart item ID
   */
  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId)
    if (result.success) {
      toast.success('Item removed from cart')
    } else {
      toast.error(result.error || 'Failed to remove item')
    }
  }

  /**
   * Handle proceed to checkout
   */
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const totals = getTotals()
  const itemCount = getItemCount()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading state */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Not authenticated message */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please login to view your cart</h1>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty cart message */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cart header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.cart_item_id} className="flex items-center border-b pb-4 last:border-0">
                {/* Product image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg mr-4 flex-shrink-0"></div>
                
                {/* Product details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center space-x-2 mr-4">
                  <button
                    onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                {/* Item total and remove */}
                <div className="text-right">
                  <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveItem(item.cart_item_id)}
                    className="text-red-600 hover:text-red-800 text-sm mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Totals breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${totals.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Proceed to Checkout
            </button>

            {/* Continue shopping link */}
            <Link
              to="/products"
              className="block text-center text-blue-600 hover:text-blue-800 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
