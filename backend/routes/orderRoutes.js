/**
 * Order Routes
 * Handles all order-related API endpoints
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import express from 'express'
import * as orderModel from '../models/orderModel.js'
import * as cartModel from '../models/cartModel.js'
import * as invoiceModel from '../models/invoiceModel.js'
import * as voucherModel from '../models/voucherModel.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import { sendInvoiceEmail } from '../utils/emailService.js'
import { getStripeClient } from '../utils/stripeService.js'
import { getShippingQuote } from '../utils/shippingQuoteService.js'

const router = express.Router()

const buildInvoiceData = (order, paymentStatus) => ({
  order_id: order.id,
  user_id: order.user_id,
  subtotal: parseFloat(order.total_price) - parseFloat(order.tax_price) - parseFloat(order.shipping_price),
  tax_amount: parseFloat(order.tax_price),
  shipping_amount: parseFloat(order.shipping_price),
  total_amount: parseFloat(order.total_price),
  payment_method: order.payment_method,
  payment_status: paymentStatus,
  billing_address: {
    address: order.address,
    city: order.city,
    postal_code: order.postal_code,
    country: order.country,
  },
  shipping_address: {
    address: order.address,
    city: order.city,
    postal_code: order.postal_code,
    country: order.country,
  },
})

const finalizePaymentAndInvoice = async (order, paymentData) => {
  if (!order.is_paid) {
    await orderModel.updateOrderPayment(order.id, paymentData)
  }

  const existingInvoice = await invoiceModel.getInvoiceByOrderId(order.id)
  if (existingInvoice) {
    return
  }

  const invoiceId = await invoiceModel.createInvoice(
    buildInvoiceData(order, paymentData.payment_status)
  )
  const createdInvoice = await invoiceModel.getInvoiceById(invoiceId, order.user_id)

  if (createdInvoice && order.user_email) {
    try {
      await sendInvoiceEmail(order.user_email, order.user_name || 'Customer', createdInvoice)
      await invoiceModel.markInvoiceEmailSent(invoiceId)
    } catch (emailError) {
      // Email sending is optional and shouldn't block order completion
    }
  }
}

/**
 * POST /api/orders
 * Create new order from cart
 * @author Thang Truong
 * @date 2025-12-12
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
    const shippingQuote = await getShippingQuote({
      subtotal: subtotalAfterDiscount,
      destinationPostcode: shippingAddress.postalCode,
      destinationCountry: shippingAddress.country,
    })
    const shippingPrice = Number(shippingQuote.amount) || 0
    const totalPrice = subtotalAfterDiscount + taxPrice + shippingPrice

    // Create order
    const orderId = await orderModel.createOrder({
      user_id: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Stripe',
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
 * POST /api/orders/:id/payment-intent
 * Create Stripe PaymentIntent for an existing order
 */
router.post('/:id/payment-intent', protect, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    const order = await orderModel.getOrderById(orderId, req.user.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.is_paid) {
      return res.status(400).json({ message: 'Order is already paid' })
    }

    const totalAmount = Number(order.total_price)
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid order total amount' })
    }

    const stripe = getStripeClient()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: 'usd',
      metadata: {
        orderId: String(order.id),
        userId: String(req.user.id),
      },
      receipt_email: req.user.email || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * GET /api/orders
 * Get user's orders
 * @author Thang Truong
 * @date 2025-12-12
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
 * @author Thang Truong
 * @date 2025-12-12
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
 * Update order payment status (mock payment) and send invoice email
 * @author Thang Truong
 * @date 2025-12-12
 */
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id)
    
    // Verify order belongs to user
    const order = await orderModel.getOrderById(orderId, req.user.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.is_paid) {
      return res.json({ message: 'Payment already processed' })
    }

    const paymentIntentId = req.body.payment_intent_id
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'payment_intent_id is required' })
    }

    const stripe = getStripeClient()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not succeeded yet' })
    }

    if (paymentIntent.metadata?.orderId !== String(orderId)) {
      return res.status(400).json({ message: 'Payment does not match this order' })
    }

    if (paymentIntent.metadata?.userId && paymentIntent.metadata.userId !== String(req.user.id)) {
      return res.status(400).json({ message: 'Payment does not match this user' })
    }

    const paymentData = {
      payment_result_id: paymentIntent.id,
      payment_status: paymentIntent.status,
      payment_update_time: new Date(paymentIntent.created * 1000).toISOString(),
      payment_email: paymentIntent.receipt_email || req.user.email,
    }

    await finalizePaymentAndInvoice(order, paymentData)

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

