/**
 * Dashboard CRUD Utilities
 * Utility functions for all CRUD operations on dashboard
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import axios from 'axios'
import { toast } from 'react-toastify'

/**
 * Update order status
 * @param {number} orderId - Order ID
 * @param {string} newStatus - New status
 * @returns {Promise<Object>} Updated order
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const response = await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus })
    toast.success('Order status updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update order status'
    toast.error(message)
    throw error
  }
}

/**
 * Bulk update orders
 * @param {Array<number>} orderIds - Order IDs
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkUpdateOrders = async (orderIds, updates) => {
  try {
    const response = await axios.post('/api/admin/orders/bulk-update', { orderIds, ...updates })
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update orders'
    toast.error(message)
    throw error
  }
}

/**
 * Delete order
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`/api/admin/orders/${orderId}`)
    toast.success('Order deleted successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete order'
    toast.error(message)
    throw error
  }
}

/**
 * Quick create product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 * @author Thang Truong
 * @date 2025-12-12
 */
export const quickCreateProduct = async (productData) => {
  try {
    const response = await axios.post('/api/admin/products/quick-create', productData)
    toast.success('Product created successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create product'
    toast.error(message)
    throw error
  }
}

/**
 * Update product stock
 * @param {number} productId - Product ID
 * @param {number} newStock - New stock level
 * @returns {Promise<Object>} Updated product
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateProductStock = async (productId, newStock) => {
  try {
    const response = await axios.put(`/api/admin/products/${productId}/stock`, { stock: newStock })
    toast.success('Stock updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update stock'
    toast.error(message)
    throw error
  }
}

/**
 * Update product price
 * @param {number} productId - Product ID
 * @param {number} newPrice - New price
 * @returns {Promise<Object>} Updated product
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateProductPrice = async (productId, newPrice) => {
  try {
    const response = await axios.put(`/api/admin/products/${productId}/price`, { price: newPrice })
    toast.success('Price updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update price'
    toast.error(message)
    throw error
  }
}

/**
 * Update product status
 * @param {number} productId - Product ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<Object>} Updated product
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateProductStatus = async (productId, isActive) => {
  try {
    const response = await axios.put(`/api/admin/products/${productId}/status`, { isActive })
    toast.success('Product status updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update product status'
    toast.error(message)
    throw error
  }
}

/**
 * Bulk update products
 * @param {Array<number>} productIds - Product IDs
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkUpdateProducts = async (productIds, updates) => {
  try {
    const response = await axios.post('/api/admin/products/bulk-update', { productIds, updates })
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update products'
    toast.error(message)
    throw error
  }
}

/**
 * Delete product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`/api/admin/products/${productId}`)
    toast.success('Product deleted successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete product'
    toast.error(message)
    throw error
  }
}

/**
 * Quick create user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 * @author Thang Truong
 * @date 2025-12-12
 */
export const quickCreateUser = async (userData) => {
  try {
    const response = await axios.post('/api/admin/users/quick-create', userData)
    toast.success('User created successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create user'
    toast.error(message)
    throw error
  }
}

/**
 * Update user role
 * @param {number} userId - User ID
 * @param {string} newRole - New role
 * @returns {Promise<Object>} Updated user
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole })
    toast.success('User role updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update user role'
    toast.error(message)
    throw error
  }
}

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`/api/admin/users/${userId}`)
    toast.success('User deleted successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete user'
    toast.error(message)
    throw error
  }
}

/**
 * Approve review
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object>} Updated review
 * @author Thang Truong
 * @date 2025-12-12
 */
export const approveReview = async (reviewId) => {
  try {
    const response = await axios.put(`/api/admin/reviews/${reviewId}/approve`)
    toast.success('Review approved successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to approve review'
    toast.error(message)
    throw error
  }
}

/**
 * Reject review
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object>} Updated review
 * @author Thang Truong
 * @date 2025-12-12
 */
export const rejectReview = async (reviewId) => {
  try {
    const response = await axios.put(`/api/admin/reviews/${reviewId}/reject`)
    toast.success('Review rejected successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to reject review'
    toast.error(message)
    throw error
  }
}

/**
 * Delete review
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`/api/admin/reviews/${reviewId}`)
    toast.success('Review deleted successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete review'
    toast.error(message)
    throw error
  }
}

/**
 * Bulk approve reviews
 * @param {Array<number>} reviewIds - Review IDs
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const bulkApproveReviews = async (reviewIds) => {
  try {
    const response = await axios.post('/api/admin/reviews/bulk-approve', { reviewIds })
    toast.success(response.data.message)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to approve reviews'
    toast.error(message)
    throw error
  }
}

/**
 * Approve comment
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object>} Updated comment
 * @author Thang Truong
 * @date 2025-12-12
 */
export const approveComment = async (commentId) => {
  try {
    const response = await axios.post(`/api/comments/${commentId}/approve`)
    toast.success('Comment approved successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to approve comment'
    toast.error(message)
    throw error
  }
}

/**
 * Reject comment
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object>} Updated comment
 * @author Thang Truong
 * @date 2025-12-12
 */
export const rejectComment = async (commentId) => {
  try {
    const response = await axios.post(`/api/comments/${commentId}/reject`)
    toast.success('Comment rejected successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to reject comment'
    toast.error(message)
    throw error
  }
}

/**
 * Delete comment
 * @param {number} commentId - Comment ID
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`/api/admin/comments/${commentId}`)
    toast.success('Comment deleted successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete comment'
    toast.error(message)
    throw error
  }
}

/**
 * Create voucher
 * @param {Object} voucherData - Voucher data
 * @returns {Promise<Object>} Created voucher
 * @author Thang Truong
 * @date 2025-12-12
 */
export const createVoucher = async (voucherData) => {
  try {
    const response = await axios.post('/api/admin/vouchers/quick-create', voucherData)
    toast.success('Voucher created successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create voucher'
    toast.error(message)
    throw error
  }
}

/**
 * Update voucher status
 * @param {number} voucherId - Voucher ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<Object>} Updated voucher
 * @author Thang Truong
 * @date 2025-12-12
 */
export const updateVoucherStatus = async (voucherId, isActive) => {
  try {
    const response = await axios.put(`/api/admin/vouchers/${voucherId}/status`, { isActive })
    toast.success('Voucher status updated successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update voucher status'
    toast.error(message)
    throw error
  }
}

/**
 * Delete voucher
 * @param {number} voucherId - Voucher ID
 * @returns {Promise<Object>} Result
 * @author Thang Truong
 * @date 2025-12-12
 */
export const deleteVoucher = async (voucherId) => {
  try {
    const response = await axios.delete(`/api/admin/vouchers/${voucherId}`)
    toast.success('Voucher deleted successfully')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete voucher'
    toast.error(message)
    throw error
  }
}
