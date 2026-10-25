/**
 * Dashboard API Utility
 * These functions use the typed client, which calls the same Axios instance
 * as the auth interceptors.
 */

export {
  fetchCustomerInsights,
  fetchDashboardOverview,
  fetchOrderStatistics,
  fetchPerformanceMetrics,
  fetchRecentActivity,
  fetchRevenueChart,
  fetchSalesAnalytics,
  fetchSalesByCategory,
  fetchTopProducts,
} from "../api/admin.ts";
