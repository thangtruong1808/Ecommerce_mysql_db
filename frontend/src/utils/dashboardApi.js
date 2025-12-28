/**
 * Dashboard API Utility
 * Functions to fetch dashboard data.
 * These functions now allow errors to propagate to be handled by axios interceptors
 * and the calling component, which prevents silent failures and ensures
 * the token refresh mechanism works correctly.
 *
 * @author Thang Truong
 * @date 2025-12-24
 */

import axios from "axios";

/**
 * Fetch dashboard overview statistics.
 * @param {string} period - Time period (today, week, month, year, all).
 * @returns {Promise<Object>} Dashboard overview data.
 * @author Thang Truong
 * @date 2025-12-24
 */
export const fetchDashboardOverview = async (period = "month") => {
  // const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:5000";
  // const response = await axios.get(`${API_BASE_URL}/api/admin/stats/overview`, {
  //   params: { period },
  // });
  const response = await axios.get("/api/admin/stats/overview", {
    params: { period },
  });
  return response.data;
};

/**
 * Fetch sales analytics.
 * @param {string} period - Time period.
 * @returns {Promise<Object>} Sales analytics data.
 */
export const fetchSalesAnalytics = async (period = "month") => {
  const response = await axios.get("/api/admin/stats/sales", {
    params: { period },
  });
  return response.data;
};

/**
 * Fetch revenue chart data.
 * @param {string} period - Time period.
 * @returns {Promise<Array>} Revenue chart data.
 */
export const fetchRevenueChart = async (period = "month") => {
  const response = await axios.get("/api/admin/stats/revenue-chart", {
    params: { period },
  });
  return response.data || [];
};

/**
 * Fetch sales by category data.
 * @param {string} period - Time period.
 * @returns {Promise<Array>} Sales by category data.
 * @author Thang Truong
 * @date 2025-12-24
 */
export const fetchSalesByCategory = async (period = "month") => {
  const response = await axios.get("/api/admin/stats/revenue-by-category", {
    params: { period },
  });
  return response.data || [];
};

/**
 * Fetch order statistics.
 * @param {string} period - Time period.
 * @returns {Promise<Object>} Order statistics.
 */
export const fetchOrderStatistics = async (period = "month") => {
  const response = await axios.get("/api/admin/stats/orders", {
    params: { period },
  });
  return response.data;
};

/**
 * Fetch customer insights.
 * @param {string} period - Time period.
 * @returns {Promise<Object>} Customer insights data.
 * @author Thang Truong
 * @date 2025-12-24
 */
export const fetchCustomerInsights = async (period = "month") => {
  const response = await axios.get("/api/admin/stats/customers", {
    params: { period },
  });
  return response.data || null;
};

/**
 * Fetch top products.
 * @param {string} period - Time period.
 * @param {number} limit - Number of products to return.
 * @returns {Promise<Array>} Top products data.
 * @author Thang Truong
 * @date 2025-12-24
 */
export const fetchTopProducts = async (period = "month", limit = 10) => {
  const response = await axios.get("/api/admin/stats/top-products", {
    params: { period, limit },
  });
  return response.data || [];
};

/**
 * Fetch recent activity.
 * @param {number} limit - Number of activities to return.
 * @returns {Promise<Array>} Recent activities.
 * @author Thang Truong
 * @date 2025-12-24
 */
export const fetchRecentActivity = async (limit = 15) => {
  const response = await axios.get("/api/admin/stats/recent-activity", {
    params: { limit },
  });
  return response.data || [];
};

/**
 * Fetch performance metrics.
 * @param {string} period - Time period.
 * @returns {Promise<Object>} Performance metrics.
 * @author Thang Truong
 * @date 2025-12-24
 */
export const fetchPerformanceMetrics = async (period = "month") => {
  const response = await axios.get("/api/admin/stats/performance", {
    params: { period },
  });
  return response.data;
};
