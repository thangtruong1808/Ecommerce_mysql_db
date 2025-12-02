/**
 * Order Routes
 * Handles all order-related API endpoints
 * 
 * @author Thang Truong
 * @date 2024-12-19
 */

import express from 'express'
import * as orderModel from '../models/orderModel.js'
import * as cartModel from '../models/cartModel.js'
import * as invoiceModel from '../models/invoiceModel.js'
import * as voucherModel from '../models/voucherModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

/**
 * POST /api/orders
 * Create new order from cart
 */
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, voucher_code } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items are required' })
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' })
    }

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    // Validate and apply voucher if provided
    let voucherId = null
    let voucherDiscount = 0
    
    if (voucher_code) {
      const validation = await voucherModel.validateVoucher(voucher_code, req.user.id, subtotal)
      
      if (!validation.valid) {
        return res.status(400).json({ message: validation.error })
      }
      
      voucherId = validation.voucher.id
      
      // Calculate discount amount
      if (validation.voucher.discount_type === 'percentage') {
        voucherDiscount = (subtotal * validation.voucher.discount_value) / 100
        if (validation.voucher.max_discount_amount) {
          voucherDiscount = Math.min(voucherDiscount, validation.voucher.max_discount_amount)
        }
      } else {
        voucherDiscount = validation.voucher.discount_value
      }
    }
    
    // Calculate totals (voucher discount applied before tax and shipping)
    const subtotalAfterDiscount = Math.max(0, subtotal - voucherDiscount)
    const taxPrice = subtotalAfterDiscount * 0.1 // 10% tax
    const shippingPrice = subtotalAfterDiscount > 100 ? 0 : 10 // Free shipping over $100
    const totalPrice = subtotalAfterDiscount + taxPrice + shippingPrice

    // Create order
    const orderId = await orderModel.createOrder({
      user_id: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Mock Payment',
      taxPrice,
      shippingPrice,
      totalPrice,
      voucher_id: voucherId,
      voucher_discount: voucherDiscount,
    })

    // Record voucher usage if voucher was used
    if (voucherId) {
      await voucherModel.useVoucher(voucherId, req.user.id, orderId)
    }

    // Clear cart after order creation
    await cartModel.clearCart(req.user.id)

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/orders
 * Get user's orders
 */
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const orders = await orderModel.getUserOrders(req.user.id, { page })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/orders/:id
 * Get order details
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await orderModel.getOrderById(parseInt(req.params.id), req.user.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/orders/:id/pay
 * Update order payment status (mock payment)
 */
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    
    // Verify order belongs to user
    const order = await orderModel.getOrderById(orderId, req.user.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Update payment status
    const paymentData = {
      payment_result_id: req.body.payment_result_id || `MOCK-${Date.now()}`,
      payment_status: req.body.payment_status || 'completed',
      payment_update_time: req.body.payment_update_time || new Date().toISOString(),
      payment_email: req.body.payment_email || req.user.email,
    }

    await orderModel.updateOrderPayment(orderId, paymentData)

    // Get updated order for invoice
    const updatedOrder = await orderModel.getOrderById(orderId, req.user.id)
    
    // Generate invoice
    const invoiceData = {
      order_id: orderId,
      user_id: req.user.id,
      subtotal: parseFloat(updatedOrder.total_price) - parseFloat(updatedOrder.tax_price) - parseFloat(updatedOrder.shipping_price),
      tax_amount: parseFloat(updatedOrder.tax_price),
      shipping_amount: parseFloat(updatedOrder.shipping_price),
      total_amount: parseFloat(updatedOrder.total_price),
      payment_method: updatedOrder.payment_method,
      payment_status: paymentData.payment_status,
      billing_address: {
        address: updatedOrder.address,
        city: updatedOrder.city,
        postal_code: updatedOrder.postal_code,
        country: updatedOrder.country,
      },
      shipping_address: {
        address: updatedOrder.address,
        city: updatedOrder.city,
        postal_code: updatedOrder.postal_code,
        country: updatedOrder.country,
      },
    }

    await invoiceModel.createInvoice(invoiceData)

    res.json({ message: 'Payment processed successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/orders/admin/all
 * Get all orders (admin only)
 */
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const status = req.query.status || null
    const orders = await orderModel.getAllOrders({ page, status })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * PUT /api/orders/:id/deliver
 * Mark order as delivered (admin only)
 */
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const updated = await orderModel.updateOrderDelivery(parseInt(req.params.id))
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json({ message: 'Order marked as delivered' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router

