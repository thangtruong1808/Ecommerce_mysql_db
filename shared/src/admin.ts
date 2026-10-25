import type { DecimalValue, StatsPeriod } from "./common";
import type { Product } from "./catalog";
import type { Order } from "./commerce";

export interface SalesOverview {
  totalSales: number;
  orderCount: number;
  growth: number;
}

export interface RevenuePoint {
  date: string | Date;
  revenue: number;
  orders: number;
}

export interface OrderStatusSlice {
  status: "delivered" | "paid" | "pending" | string;
  count: number;
}

export interface OrderStatistics {
  total: number;
  statusBreakdown: OrderStatusSlice[];
  growth: number;
}

export interface CustomerGrowthPoint {
  date: string;
  newCustomers: number;
}

export interface CustomerInsights {
  totalCustomers: number;
  newCustomers: number;
  growth: number;
  growthData: CustomerGrowthPoint[];
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  price: number;
}

export interface BestSeller {
  id: number;
  name: string;
  unitsSold: number;
}

export interface InventoryOverview {
  totalProducts: number;
  stockValue: number;
  lowStockProducts: LowStockProduct[];
  bestSellers: BestSeller[];
}

export interface CategoryRevenue {
  id: number;
  name: string;
  revenue: number;
  orderCount: number;
  /** `toFixed(1)` returns a string. Zero is a number. */
  percentage: number | string;
}

export interface TopProductStat {
  id: number;
  name: string;
  unitsSold: number;
  revenue: number;
}

export type ActivityType = "order" | "registration" | "review" | "comment";

export interface ActivityItem {
  id: number;
  type: ActivityType | string;
  title: string;
  description: string;
  amount?: number;
  user?: string;
  createdAt: string | Date;
}

export interface PerformanceMetrics {
  conversionRate: number;
  aov: number;
  revenuePerCustomer: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  aovGrowth: number;
  conversionGrowth: number;
  newCustomers: number;
}

export interface DashboardOverview {
  sales: { total: number; growth: number };
  orders: { total: number; growth: number };
  users: { total: number; new: number; growth: number };
  products: { total: number };
  recentOrders: Order[];
  lowStockProducts: LowStockProduct[];
  performance: PerformanceMetrics;
}

export interface SalesAnalytics {
  overview: SalesOverview;
  trend: RevenuePoint[];
}

export interface StatsQuery {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface LegacyDashboardStats {
  sales: { total: number };
  orders: { total: number };
  users: { total: number };
  products: { total: DecimalValue | number };
  recentOrders: Order[];
  lowStockProducts: Product[];
}
