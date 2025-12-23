/**
 * Dashboard API Utility
 * Functions to fetch dashboard data
 * 
 * @author Thang Truong
 * @date 2025-12-12
 */

import axios from 'axios'

/**
 * Fetch dashboard overview statistics
 * @param {string} period - Time period (today, week, month, year, all)
 * @returns {Promise<Object>} Dashboard overview data
 */
export const fetchDashboardOverview = async (period = 'month') => {
  try {
    const response = await axios.get('/api/admin/stats/overview', {
      params: { period },
    })
    return response.data
  } catch (error) {
    // Fallback to basic stats endpoint if overview doesn't exist
    if (error.response?.status === 404) {
      const response = await axios.get('/api/admin/stats')
      return response.data
    }
    throw error
  }
}

/**
 * Fetch sales analytics
 * @param {string} period - Time period
 * @returns {Promise<Object>} Sales analytics data
 */
export const fetchSalesAnalytics = async (period = 'month') => {
  try {
    const response = await axios.get('/api/admin/stats/sales', {
      params: { period },
    })
    return response.data
  } catch (error) {
    return null
  }
}

/**
 * Fetch revenue chart data
 * @param {string} period - Time period
 * @returns {Promise<Array>} Revenue chart data
 */
export const fetchRevenueChart = async (period = 'month') => {
  try {
    const response = await axios.get('/api/admin/stats/revenue-chart', {
      params: { period },
    })
    return response.data
  } catch (error) {
    return []
  }
}

/**
 * Fetch sales by category data
 * @param {string} period - Time period
 * @returns {Promise<Array>} Sales by category data
 */
export const fetchSalesByCategory = async (period = 'month') => {
  // Let axios interceptor handle 401 retries automatically
  // If request fails after retry, throw error so Promise.allSettled can handle it
  // This preserves existing state when requests fail
  const response = await axios.get('/api/admin/stats/revenue-by-category', {
    params: { period },
  })
  return response.data || []
}

/**
 * Fetch order statistics
 * @param {string} period - Time period
 * @returns {Promise<Object>} Order statistics
 */
export const fetchOrderStatistics = async (period = 'month') => {
  try {
    const response = await axios.get('/api/admin/stats/orders', {
      params: { period },
    })
    return response.data
  } catch (error) {
    return null
  }
}

/**
 * Fetch customer insights
 * @param {string} period - Time period
 * @returns {Promise<Object>} Customer insights data
 */
export const fetchCustomerInsights = async (period = 'month') => {
  // Let axios interceptor handle 401 retries automatically
  // If request fails after retry, throw error so Promise.allSettled can handle it
  // This preserves existing state when requests fail
  const response = await axios.get('/api/admin/stats/customers', {
    params: { period },
  })
  return response.data || null
}

/**
 * Fetch top products
 * @param {string} period - Time period
 * @param {number} limit - Number of products to return
 * @returns {Promise<Array>} Top products data
 */
export const fetchTopProducts = async (period = 'month', limit = 10) => {
  // Let axios interceptor handle 401 retries automatically
  // If request fails after retry, throw error so Promise.allSettled can handle it
  // This preserves existing state when requests fail
  const response = await axios.get('/api/admin/stats/top-products', {
    params: { period, limit },
  })
  return response.data || []
}

/**
 * Fetch recent activity
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Recent activities
 */
export const fetchRecentActivity = async (limit = 15) => {
  // Let axios interceptor handle 401 retries automatically
  // If request fails after retry, throw error so Promise.allSettled can handle it
  // This preserves existing state when requests fail
  const response = await axios.get('/api/admin/stats/recent-activity', {
    params: { limit },
  })
  return response.data || []
}

/**
 * Fetch performance metrics
 * @param {string} period - Time period
 * @returns {Promise<Object>} Performance metrics
 */
export const fetchPerformanceMetrics = async (period = 'month') => {
  try {
    const response = await axios.get('/api/admin/stats/performance', {
      params: { period },
    })
    return response.data
  } catch (error) {
    return null
  }
}
