import type {
  ActivityItem,
  CategoryRevenue,
  CustomerInsights,
  DashboardOverview,
  OrderStatistics,
  PerformanceMetrics,
  RevenuePoint,
  SalesAnalytics,
  TopProductStat,
} from "@shared/admin";
import type { StatsPeriod } from "@shared/common";
import { apiGet } from "./client";

export const fetchDashboardOverview = (period: StatsPeriod = "month") =>
  apiGet<DashboardOverview>("/api/admin/stats/overview", { params: { period } });

export const fetchSalesAnalytics = (period: StatsPeriod = "month") =>
  apiGet<SalesAnalytics>("/api/admin/stats/sales", { params: { period } });

export const fetchRevenueChart = async (period: StatsPeriod = "month") => {
  const data = await apiGet<RevenuePoint[] | null>("/api/admin/stats/revenue-chart", {
    params: { period },
  });
  return data || [];
};

export const fetchSalesByCategory = async (period: StatsPeriod = "month") => {
  const data = await apiGet<CategoryRevenue[] | null>(
    "/api/admin/stats/revenue-by-category",
    { params: { period } }
  );
  return data || [];
};

export const fetchOrderStatistics = (period: StatsPeriod = "month") =>
  apiGet<OrderStatistics>("/api/admin/stats/orders", { params: { period } });

export const fetchCustomerInsights = async (period: StatsPeriod = "month") => {
  const data = await apiGet<CustomerInsights | null>("/api/admin/stats/customers", {
    params: { period },
  });
  return data || null;
};

export const fetchTopProducts = async (period: StatsPeriod = "month", limit = 10) => {
  const data = await apiGet<TopProductStat[] | null>("/api/admin/stats/top-products", {
    params: { period, limit },
  });
  return data || [];
};

export const fetchRecentActivity = async (limit = 15) => {
  const data = await apiGet<ActivityItem[] | null>("/api/admin/stats/recent-activity", {
    params: { limit },
  });
  return data || [];
};

export const fetchPerformanceMetrics = (period: StatsPeriod = "month") =>
  apiGet<PerformanceMetrics>("/api/admin/stats/performance", { params: { period } });
