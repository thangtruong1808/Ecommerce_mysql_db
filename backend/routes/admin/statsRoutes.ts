
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import * as analyticsModel from "../../models/analyticsModel.js";

const router = express.Router();

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const db = (await import("../../config/db.js")).default;

    // Get total sales
    const [salesResult] = await db.execute<RowDataPacket[]>(
      "SELECT SUM(total_price) as total_sales FROM orders WHERE is_paid = 1"
    );

    // Get total orders
    const [ordersResult] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM orders"
    );

    // Get total users
    const [usersResult] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM users"
    );

    // Get total products
    const [productsResult] = await db.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM products"
    );

    // Get recent orders
    const [recentOrders] = await db.execute<RowDataPacket[]>(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 5`
    );

    // Get low stock products
    const [lowStock] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM products WHERE stock < 10 ORDER BY stock ASC LIMIT 5"
    );

    res.json({
      sales: {
        total: parseFloat(salesResult[0].total_sales || 0),
      },
      orders: {
        total: ordersResult[0].total,
      },
      users: {
        total: usersResult[0].total,
      },
      products: {
        total: productsResult[0].total,
      },
      recentOrders,
      lowStockProducts: lowStock,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/overview
 * Get dashboard overview with all key metrics
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/overview", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const db = (await import("../../config/db.js")).default;

    // Get sales overview
    const salesOverview = await analyticsModel.getSalesOverview(
      period,
      startDate,
      endDate
    );

    // Get order statistics
    const orderStats = await analyticsModel.getOrderStatistics(
      period,
      startDate,
      endDate
    );

    // Get customer insights
    const customerInsights = await analyticsModel.getCustomerInsights(
      period,
      startDate,
      endDate
    );

    // Get inventory overview
    const inventory = await analyticsModel.getInventoryOverview();

    // Get performance metrics
    const performance = await analyticsModel.getPerformanceMetrics(
      period,
      startDate,
      endDate
    );

    // Get recent orders
    const [recentOrders] = await db.execute<RowDataPacket[]>(
      `SELECT o.*, u.name as user_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC 
       LIMIT 5`
    );

    res.json({
      sales: {
        total: salesOverview.totalSales,
        growth: salesOverview.growth,
      },
      orders: {
        total: orderStats.total,
        growth: orderStats.growth,
      },
      users: {
        total: customerInsights.totalCustomers,
        new: customerInsights.newCustomers,
        growth: customerInsights.growth,
      },
      products: {
        total: inventory.totalProducts,
      },
      recentOrders,
      lowStockProducts: inventory.lowStockProducts,
      performance,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/sales
 * Get sales analytics with time period support
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/sales", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const salesOverview = await analyticsModel.getSalesOverview(
      period,
      startDate,
      endDate
    );
    const salesTrend = await analyticsModel.getSalesTrend(
      period,
      "day",
      startDate,
      endDate
    );

    res.json({
      overview: salesOverview,
      trend: salesTrend,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/orders
 * Get order statistics and trends
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/orders", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const orderStats = await analyticsModel.getOrderStatistics(
      period,
      startDate,
      endDate
    );

    res.json(orderStats);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/customers
 * Get customer insights and growth
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/customers", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const customerInsights = await analyticsModel.getCustomerInsights(
      period,
      startDate,
      endDate
    );

    res.json(customerInsights);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/inventory
 * Get inventory management data
 * Note: Inventory data is not time-period dependent
 */
router.get("/inventory", async (req: Request, res: Response) => {
  try {
    const inventory = await analyticsModel.getInventoryOverview();

    res.json(inventory);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/revenue-chart
 * Get revenue data for charts (supports daily/weekly/monthly)
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/revenue-chart", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    let groupBy = "day";

    if (period === "year") {
      groupBy = "month";
    } else if (period === "month") {
      groupBy = "day";
    } else if (period === "week") {
      groupBy = "day";
    } else {
      groupBy = "day";
    }

    const revenueData = await analyticsModel.getSalesTrend(
      period,
      groupBy,
      startDate,
      endDate
    );

    res.json(revenueData);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/revenue-by-category
 * Get revenue breakdown by category (for pie charts)
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/revenue-by-category", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const categoryData = await analyticsModel.getRevenueByCategory(
      period,
      startDate,
      endDate
    );

    res.json(categoryData);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/top-products
 * Get top selling products
 * Query params: period (today, week, month, year, all), startDate, endDate, limit
 */
router.get("/top-products", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const limit = parseInt(String(req.query.limit)) || 10;
    const topProducts = await analyticsModel.getTopProducts(
      period,
      limit,
      startDate,
      endDate
    );

    res.json(topProducts);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/recent-activity
 * Get recent orders, reviews, comments, registrations
 * Query params: limit (default: 15)
 */
router.get("/recent-activity", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(String(req.query.limit)) || 15;
    const activities = await analyticsModel.getRecentActivity(limit);

    res.json(activities);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/stats/performance
 * Get performance metrics (conversion rate, AOV, etc.)
 * Query params: period (today, week, month, year, all), startDate, endDate
 */
router.get("/performance", async (req: Request, res: Response) => {
  try {
    const period = req.query.period || "month";
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;
    const performance = await analyticsModel.getPerformanceMetrics(
      period,
      startDate,
      endDate
    );

    res.json(performance);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

export default router;
