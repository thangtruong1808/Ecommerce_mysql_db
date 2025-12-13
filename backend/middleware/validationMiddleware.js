/**
 * Validation Middleware
 * Validates requests for CRUD operations
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Validate bulk operation request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
export const validateBulkOperation = (req, res, next) => {
  const { orderIds, productIds, userIds, reviewIds, commentIds } = req.body

  const ids = orderIds || productIds || userIds || reviewIds || commentIds

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'IDs must be a non-empty array' })
  }

  // Validate all IDs are numbers
  if (!ids.every(id => Number.isInteger(parseInt(id)) && parseInt(id) > 0)) {
    return res.status(400).json({ message: 'All IDs must be positive integers' })
  }

  next()
}

/**
 * Validate order status transition
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
export const validateOrderStatusTransition = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id)
    const { status } = req.body

    if (!status || !['pending', 'processing', 'paid', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be: pending, processing, paid, delivered, or cancelled' 
      })
    }

    // Get current order status
    const [orders] = await db.execute(
      'SELECT is_paid, is_delivered FROM orders WHERE id = ?',
      [orderId]
    )

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const order = orders[0]
    const currentStatus = order.is_delivered ? 'delivered' : 
                         order.is_paid ? 'paid' : 'pending'

    // Validate transition (basic validation - can be enhanced)
    if (currentStatus === 'delivered' && status !== 'delivered') {
      return res.status(400).json({ message: 'Cannot change status of delivered order' })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Validate product deletion (check if product has orders)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
export const validateProductDeletion = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id)

    const [orderItems] = await db.execute(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?',
      [productId]
    )

    if (orderItems[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete product that has been ordered. Consider setting stock to 0 instead.' 
      })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * Validate user deletion (check if user has orders)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @author Thang Truong
 * @date 2025-12-12
 */
export const validateUserDeletion = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id)

    // Check if user has orders
    const [orders] = await db.execute(
      'SELECT COUNT(*) as count FROM orders WHERE user_id = ?',
      [userId]
    )

    if (orders[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user that has orders. Consider deactivating instead.' 
      })
    }

    next()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
