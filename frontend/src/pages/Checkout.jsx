/**
 * Checkout Page Component
 * Handles order placement with shipping address and mock payment
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import ProtectedRoute from '../components/ProtectedRoute'
import AddressForm from '../components/AddressForm'
import VoucherForm from '../components/VoucherForm'
import Button from '../components/Button'
import { FaCheck } from 'react-icons/fa'

/**
 * Checkout component
 * @returns {JSX.Element} Checkout page
 */
const Checkout = () => {
  const { cart, getTotals, refreshCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const [voucherCode, setVoucherCode] = useState(null)
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const totals = getTotals()
  
  // Calculate totals with voucher discount
  const subtotal = totals.subtotal
  const subtotalAfterDiscount = Math.max(0, subtotal - voucherDiscount)
  const tax = subtotalAfterDiscount * 0.1
  const shipping = subtotalAfterDiscount > 100 ? 0 : 10
  const finalTotal = subtotalAfterDiscount + tax + shipping

  /**
   * Redirect if cart is empty
   */
  useEffect(() => {
    if (cart.items.length === 0 && isAuthenticated) {
      toast.error('Your cart is empty')
      navigate('/cart')
    }
  }, [cart.items.length, isAuthenticated, navigate])

  /**
   * Handle order submission
   * @param {Object} data - Form data (shipping address)
   */
  const handleOrderSubmit = async (data) => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setProcessing(true)

      // Prepare order data
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          image_url: item.image_url || '',
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: 'Mock Payment',
        voucher_code: voucherCode,
      }

      // Create order
      const response = await axios.post('/api/orders', orderData)

      // Process mock payment
      await axios.put(`/api/orders/${response.data.orderId}/pay`, {
        payment_result_id: `MOCK-${Date.now()}`,
        payment_status: 'completed',
        payment_update_time: new Date().toISOString(),
        payment_email: user?.email || '',
      })

      toast.success('Order placed successfully!')
      
      // Clear cart and redirect
      await refreshCart()
      navigate(`/orders/${response.data.orderId}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setProcessing(false)
    }
  }

  if (!isAuthenticated) {
    return <ProtectedRoute><div></div></ProtectedRoute>
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty cart message */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Checkout header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping address form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
            
            {/* Address form */}
            <form onSubmit={handleSubmit(handleOrderSubmit)} className="space-y-4">
              <AddressForm register={register} errors={errors} />
              
              {/* Payment method info */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong> Mock Payment (No real payment will be processed)
                </p>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                loading={processing}
                icon={<FaCheck />}
                className="w-full py-3"
              >
                Place Order
              </Button>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Voucher form */}
            <div className="mb-4">
              <VoucherForm
                orderTotal={subtotal}
                onVoucherApplied={(voucher, discount) => {
                  setVoucherCode(voucher.code)
                  setVoucherDiscount(discount)
                }}
                onVoucherRemoved={() => {
                  setVoucherCode(null)
                  setVoucherDiscount(0)
                }}
              />
            </div>
            
            {/* Order items */}
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.cart_item_id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Voucher Discount</span>
                  <span>-${voucherDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

