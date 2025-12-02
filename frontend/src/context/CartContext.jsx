/**
 * Cart Context
 * Manages shopping cart state and provides cart functions
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

const CartContext = createContext()

/**
 * Custom hook to use cart context
 * @returns {Object} Cart context value
 */
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

/**
 * Cart Provider Component
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)

  // Configure axios to send cookies
  axios.defaults.withCredentials = true

  /**
   * Fetch cart from server
   */
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] })
      return
    }

    try {
      setLoading(true)
      const response = await axios.get('/api/cart')
      setCart(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      const message = error.response?.data?.message || 'Failed to load cart'
      toast.error(message)
      setCart({ items: [] })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load cart when authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart({ items: [] })
    }
  }, [isAuthenticated])

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Result object
   */
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login to add items to cart' }
    }

    try {
      await axios.post('/api/cart', {
        product_id: productId,
        quantity: quantity,
      })
      await fetchCart()
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart'
      return { success: false, error: message }
    }
  }

  /**
   * Update cart item quantity
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Result object
   */
  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login' }
    }

    try {
      await axios.put(`/api/cart/${itemId}`, { quantity })
      await fetchCart()
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity'
      return { success: false, error: message }
    }
  }

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   * @returns {Promise<Object>} Result object
   */
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login' }
    }

    try {
      await axios.delete(`/api/cart/${itemId}`)
      await fetchCart()
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item'
      return { success: false, error: message }
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise<Object>} Result object
   */
  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false, error: 'Please login' }
    }

    try {
      await axios.delete('/api/cart')
      await fetchCart()
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart'
      return { success: false, error: message }
    }
  }

  /**
   * Calculate cart totals
   * @returns {Object} Totals object
   */
  const getTotals = () => {
    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    const tax = subtotal * 0.1 // 10% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    }
  }

  /**
   * Get total items count
   * @returns {number} Total items in cart
   */
  const getItemCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotals,
    getItemCount,
    refreshCart: fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

