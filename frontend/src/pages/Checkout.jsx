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

/**
 * Checkout component
 * @returns {JSX.Element} Checkout page
 */
const Checkout = () => {
  const { cart, getTotals, refreshCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const totals = getTotals()

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
  const onSubmit = async (data) => {
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
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Address field */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
              </div>

              {/* City field */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </div>

              {/* Postal code field */}
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  {...register('postalCode', { required: 'Postal code is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Postal code"
                />
                {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
              </div>

              {/* Country field */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  {...register('country', { required: 'Country is required' })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Country"
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
              </div>

              {/* Payment method info */}
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Payment Method:</strong> Mock Payment (No real payment will be processed)
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

