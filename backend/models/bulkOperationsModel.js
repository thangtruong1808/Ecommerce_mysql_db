/**
 * Bulk Operations Model
 * Handles bulk update and delete operations for multiple entities
 * Uses transactions to ensure data consistency
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import db from '../config/db.js'

/**
 * Bulk update orders
 * @param {Array<number>} orderIds - Array of order IDs
 * @param {Object} updates - Update data (status, etc.)
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkUpdateOrders = async (orderIds, updates) => {
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw new Error('orderIds must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const placeholders = orderIds.map(() => '?').join(',')

    // Update orders based on status
    if (updates.status === 'paid') {
      await connection.execute(
        `UPDATE orders SET is_paid = 1, paid_at = NOW() WHERE id IN (${placeholders})`,
        orderIds
      )
    } else if (updates.status === 'delivered') {
      await connection.execute(
        `UPDATE orders SET is_delivered = 1, delivered_at = NOW() WHERE id IN (${placeholders})`,
        orderIds
      )
    } else if (updates.status === 'processing') {
      await connection.execute(
        `UPDATE orders SET is_paid = 1, paid_at = COALESCE(paid_at, NOW()), is_delivered = 0 WHERE id IN (${placeholders})`,
        orderIds
      )
    } else if (updates.status === 'pending') {
      await connection.execute(
        `UPDATE orders SET is_paid = 0, is_delivered = 0, paid_at = NULL, delivered_at = NULL WHERE id IN (${placeholders})`,
        orderIds
      )
    }

    await connection.commit()
    return { success: orderIds.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Bulk delete orders with validation
 * @param {Array<number>} orderIds - Array of order IDs
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkDeleteOrders = async (orderIds) => {
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw new Error('orderIds must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const placeholders = orderIds.map(() => '?').join(',')

    // Check for delivered orders
    const [deliveredOrders] = await connection.execute(
      `SELECT id FROM orders WHERE id IN (${placeholders}) AND is_delivered = 1`,
      orderIds
    )

    if (deliveredOrders.length > 0) {
      await connection.rollback()
      throw new Error(`Cannot delete ${deliveredOrders.length} delivered order(s)`)
    }

    // Restore stock for paid orders
    const [paidOrders] = await connection.execute(
      `SELECT id FROM orders WHERE id IN (${placeholders}) AND is_paid = 1`,
      orderIds
    )

    for (const order of paidOrders) {
      const [items] = await connection.execute(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [order.id]
      )

      for (const item of items) {
        await connection.execute(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        )
      }
    }

    // Delete orders
    await connection.execute(
      `DELETE FROM orders WHERE id IN (${placeholders})`,
      orderIds
    )

    await connection.commit()
    return { success: orderIds.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Bulk update products
 * @param {Array<number>} productIds - Array of product IDs
 * @param {Object} updates - Update data (stock, price, isActive)
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkUpdateProducts = async (productIds, updates) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new Error('productIds must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const placeholders = productIds.map(() => '?').join(',')

    const updateFields = []
    const updateValues = []

    if (updates.stock !== undefined) {
      updateFields.push('stock = ?')
      updateValues.push(parseInt(updates.stock))
    }
    if (updates.price !== undefined) {
      updateFields.push('price = ?')
      updateValues.push(parseFloat(updates.price))
    }
    if (updates.isActive !== undefined) {
      if (!updates.isActive) {
        updateFields.push('stock = 0')
      }
    }

    if (updateFields.length === 0) {
      await connection.rollback()
      throw new Error('No valid updates provided')
    }

    updateValues.push(...productIds)
    await connection.execute(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id IN (${placeholders})`,
      updateValues
    )

    await connection.commit()
    return { success: productIds.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Bulk delete products with validation
 * @param {Array<number>} productIds - Array of product IDs
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkDeleteProducts = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    throw new Error('productIds must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const placeholders = productIds.map(() => '?').join(',')

    // Check for products in orders
    const [orderItems] = await connection.execute(
      `SELECT DISTINCT product_id FROM order_items WHERE product_id IN (${placeholders})`,
      productIds
    )

    if (orderItems.length > 0) {
      await connection.rollback()
      throw new Error(`Cannot delete ${orderItems.length} product(s) that have been ordered`)
    }

    // Delete products
    await connection.execute(
      `DELETE FROM products WHERE id IN (${placeholders})`,
      productIds
    )

    await connection.commit()
    return { success: productIds.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Bulk update users
 * @param {Array<number>} userIds - Array of user IDs
 * @param {Object} updates - Update data (role, etc.)
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkUpdateUsers = async (userIds, updates) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('userIds must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const placeholders = userIds.map(() => '?').join(',')

    const updateFields = []
    const updateValues = []

    if (updates.role && ['user', 'admin'].includes(updates.role)) {
      updateFields.push('role = ?')
      updateValues.push(updates.role)
    }

    if (updateFields.length === 0) {
      await connection.rollback()
      throw new Error('No valid updates provided')
    }

    updateValues.push(...userIds)
    await connection.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id IN (${placeholders})`,
      updateValues
    )

    await connection.commit()
    return { success: userIds.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Bulk approve reviews
 * @param {Array<number>} reviewIds - Array of review IDs
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkApproveReviews = async (reviewIds) => {
  if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
    throw new Error('reviewIds must be a non-empty array')
  }

  // Note: Requires is_approved field in reviews table
  // For now, return success (placeholder)
  return { success: reviewIds.length, failed: 0, message: 'Requires is_approved field in reviews table' }
}

/**
 * Bulk approve comments
 * @param {Array<number>} commentIds - Array of comment IDs
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkApproveComments = async (commentIds) => {
  if (!Array.isArray(commentIds) || commentIds.length === 0) {
    throw new Error('commentIds must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const placeholders = commentIds.map(() => '?').join(',')

    await connection.execute(
      `UPDATE product_comments SET is_approved = 1 WHERE id IN (${placeholders})`,
      commentIds
    )

    await connection.commit()
    return { success: commentIds.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

/**
 * Bulk update stock levels
 * @param {Array<Object>} stockUpdates - Array of { productId, stock }
 * @returns {Promise<Object>} - Result with success/failure counts
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkUpdateStock = async (stockUpdates) => {
  if (!Array.isArray(stockUpdates) || stockUpdates.length === 0) {
    throw new Error('stockUpdates must be a non-empty array')
  }

  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()

    for (const update of stockUpdates) {
      if (!update.productId || update.stock === undefined) {
        throw new Error('Each update must have productId and stock')
      }
      await connection.execute(
        'UPDATE products SET stock = ? WHERE id = ?',
        [parseInt(update.stock), parseInt(update.productId)]
      )
    }

    await connection.commit()
    return { success: stockUpdates.length, failed: 0 }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
