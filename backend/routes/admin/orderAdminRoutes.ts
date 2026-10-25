
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import * as orderModel from "../../models/orderModel.js";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";
import {
  validateBulkOperation,
  validateOrderStatusTransition,
} from "../../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/orders
 * Get all orders with filters and search
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 20;
    const status = req.query.status || null;
    const search = req.query.search || null;
    const sortBy = (req.query.sortBy || "created_at") as string;
    const sortOrder = (req.query.sortOrder || "desc") as string;
    const result = await orderModel.getAllOrders({
      page,
      limit,
      status,
      search,
      sortBy,
      sortOrder,
    });
    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/order-items
 * Get all order items with pagination and filters
 */
router.get("/items", async (req: Request, res: Response) => {
  try {
    const db = (await import("../../config/db.js")).default;
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 20;
    const offset = (page - 1) * limit;
    const orderId = req.query.orderId ? parseInt(String(req.query.orderId)) : null;
    const productId = req.query.productId
      ? parseInt(String(req.query.productId))
      : null;
    const sortBy = (req.query.sortBy || "created_at") as string;
    const sortOrder = (req.query.sortOrder || "desc") as string;

    const allowedSortColumns = [
      "id",
      "order_id",
      "product_id",
      "name",
      "image_url",
      "price",
      "quantity",
      "order_number",
      "created_at",
    ];
    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const validSortOrder = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

    let query = `
      SELECT oi.*, 
             o.order_number,
             o.user_id,
             u.name as user_name,
             u.email as user_email,
             p.name as product_name
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN users u ON o.user_id = u.id
      JOIN products p ON oi.product_id = p.id
    `;
    const params = [];

    const conditions = [];
    if (orderId && !isNaN(orderId)) {
      conditions.push("oi.order_id = ?");
      params.push(orderId);
    }
    if (productId && !isNaN(productId)) {
      conditions.push("oi.product_id = ?");
      params.push(productId);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    let sortColumn = `oi.${validSortBy}`;
    if (validSortBy === "order_number") sortColumn = "o.order_number";

    query += ` ORDER BY ${sortColumn} ${validSortOrder}`;

    const countQuery = query.replace(
      "SELECT oi.*, o.order_number, o.user_id, u.name as user_name, u.email as user_email, p.name as product_name",
      "SELECT COUNT(*) as total"
    );
    const [countResult] = await db.execute<RowDataPacket[]>(countQuery, params);
    const total = countResult[0].total;

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const [rows] = await db.execute<RowDataPacket[]>(query, params);

    res.json({
      orderItems: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * GET /api/admin/order-items/:id
 * Get order item details
 */
router.get("/items/:id", async (req: Request, res: Response) => {
  try {
    const db = (await import("../../config/db.js")).default;
    const itemId = parseInt(req.params.id);

    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({ message: "Invalid order item ID" });
    }

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT oi.*, 
              o.order_number,
              o.user_id,
              u.name as user_name,
              u.email as user_email,
              p.name as product_name,
              p.price as current_price
       FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       JOIN users u ON o.user_id = u.id
       JOIN products p ON oi.product_id = p.id
       WHERE oi.id = ?`,
      [itemId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order item not found" });
    }

    res.json(rows[0]);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * PUT /api/admin/orders/:id/status
 * Update order status
 */
router.put(
  "/:id/status",
  validateOrderStatusTransition,
  async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      if (
        !status ||
        !["pending", "processing", "paid", "delivered"].includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid status. Must be: pending, processing, paid, or delivered",
        });
      }

      const db = (await import("../../config/db.js")).default;
      const order = await orderModel.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (status === "paid") {
        await db.execute<ResultSetHeader>(
          "UPDATE orders SET is_paid = 1, paid_at = NOW() WHERE id = ?",
          [orderId]
        );
      } else if (status === "delivered") {
        await db.execute<ResultSetHeader>(
          "UPDATE orders SET is_delivered = 1, delivered_at = NOW() WHERE id = ?",
          [orderId]
        );
      } else if (status === "processing") {
        await db.execute<ResultSetHeader>(
          "UPDATE orders SET is_paid = 1, paid_at = COALESCE(paid_at, NOW()), is_delivered = 0 WHERE id = ?",
          [orderId]
        );
      } else if (status === "pending") {
        await db.execute<ResultSetHeader>(
          "UPDATE orders SET is_paid = 0, is_delivered = 0, paid_at = NULL, delivered_at = NULL WHERE id = ?",
          [orderId]
        );
      }

      const updatedOrder = await orderModel.getOrderById(orderId);
      res.json(updatedOrder);
    } catch (error: unknown) {
      res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
  }
);

/**
 * PUT /api/admin/orders/:id
 * Update order details
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const {
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const order = await orderModel.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const db = (await import("../../config/db.js")).default;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (paymentMethod) {
        updateFields.push("payment_method = ?");
        updateValues.push(paymentMethod);
      }
      if (taxPrice !== undefined) {
        updateFields.push("tax_price = ?");
        updateValues.push(taxPrice);
      }
      if (shippingPrice !== undefined) {
        updateFields.push("shipping_price = ?");
        updateValues.push(shippingPrice);
      }
      if (totalPrice !== undefined) {
        updateFields.push("total_price = ?");
        updateValues.push(totalPrice);
      }

      if (updateFields.length > 0) {
        updateValues.push(orderId);
        await connection.execute<ResultSetHeader>(
          `UPDATE orders SET ${updateFields.join(", ")} WHERE id = ?`,
          updateValues
        );
      }

      if (shippingAddress) {
        const { address, city, postalCode, country } = shippingAddress;
        await connection.execute<ResultSetHeader>(
          `UPDATE shipping_addresses 
           SET address = ?, city = ?, postal_code = ?, country = ? 
           WHERE order_id = ?`,
          [address, city, postalCode, country, orderId]
        );
      }

      await connection.commit();
      const updatedOrder = await orderModel.getOrderById(orderId);
      res.json(updatedOrder);
    } catch (error: unknown) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * DELETE /api/admin/orders/:id
 * Cancel/delete order
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await orderModel.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.is_delivered) {
      return res
        .status(400)
        .json({ message: "Cannot delete a delivered order" });
    }

    const db = (await import("../../config/db.js")).default;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      if (order.is_paid) {
        const [items] = await connection.execute<RowDataPacket[]>(
          "SELECT product_id, quantity FROM order_items WHERE order_id = ?",
          [orderId]
        );

        for (const item of items) {
          await connection.execute<ResultSetHeader>(
            "UPDATE products SET stock = stock + ? WHERE id = ?",
            [item.quantity, item.product_id]
          );
        }
      }

      await connection.execute<ResultSetHeader>("DELETE FROM orders WHERE id = ?", [orderId]);

      await connection.commit();
      res.json({ message: "Order deleted successfully" });
    } catch (error: unknown) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * POST /api/admin/orders/bulk-update
 * Bulk update order statuses
 */
router.post("/bulk-update", validateBulkOperation, async (req: Request, res: Response) => {
  try {
    const { orderIds, status } = req.body;

    if (
      !status ||
      !["pending", "processing", "paid", "delivered"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await bulkOperationsModel.bulkUpdateOrders(orderIds, {
      status,
    });
    res.json({
      message: `${result.success} orders updated successfully`,
      success: result.success,
      failed: result.failed,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * POST /api/admin/orders/bulk-delete
 * Bulk delete orders
 */
router.post("/bulk-delete", validateBulkOperation, async (req: Request, res: Response) => {
  try {
    const { orderIds } = req.body;
    const result = await bulkOperationsModel.bulkDeleteOrders(orderIds);
    res.json({
      message: `${result.success} orders deleted successfully`,
      success: result.success,
      failed: result.failed,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

export default router;
