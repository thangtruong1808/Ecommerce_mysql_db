
import express from "express";
import * as productModel from "../../models/productModel.js";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";
import {
  validateBulkOperation,
  validateProductDeletion,
} from "../../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/products
 * Get all products for admin management with search and filters
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || null;
    const stock = req.query.stock || null;
    const sortBy = req.query.sortBy || "created_at";
    const sortOrder = req.query.sortOrder || "desc";
    const filters = { page, limit, search, sortBy, sortOrder };
    if (stock === "low_stock") {
      filters.minStock = 0;
      filters.maxStock = 10;
    } else if (stock === "out_of_stock") {
      filters.minStock = 0;
      filters.maxStock = 0;
    } else if (stock === "in_stock") {
      filters.minStock = 1;
    }
    const result = await productModel.getAllProducts(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      products: [],
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        total: 0,
        pages: 0,
      },
    });
  }
});

/**
 * POST /api/admin/products/quick-create
 * Quick create product from dashboard
 */
router.post("/quick-create", async (req, res) => {
  try {
    const { name, description, price, child_category_id, stock } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      !child_category_id ||
      stock === undefined
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: name, description, price, child_category_id, stock",
      });
    }

    const productId = await productModel.createProduct({
      name,
      description,
      price: parseFloat(price),
      child_category_id: parseInt(child_category_id),
      stock: parseInt(stock),
    });

    const product = await productModel.getProductById(productId);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/products/:id/stock
 * Update product stock inline
 */
router.put("/:id/stock", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res
        .status(400)
        .json({ message: "Stock must be a non-negative number" });
    }

    const updated = await productModel.updateProduct(productId, {
      stock: parseInt(stock),
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/products/:id/status
 * Toggle product active/inactive (using stock > 0 as active)
 */
router.put("/:id/status", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { isActive } = req.body;

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newStock = isActive ? (product.stock === 0 ? 1 : product.stock) : 0;
    const updated = await productModel.updateProduct(productId, {
      stock: newStock,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/products/:id/price
 * Update product price inline
 */
router.put("/:id/price", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { price } = req.body;

    if (price === undefined || price < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a non-negative number" });
    }

    const updated = await productModel.updateProduct(productId, {
      price: parseFloat(price),
    });
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/products/bulk-update
 * Bulk update products (stock, status, price)
 */
router.post(
  "/bulk-update",
  validateBulkOperation,
  async (req, res) => {
    try {
      const { productIds, updates } = req.body;

      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No updates provided" });
      }

      const result = await bulkOperationsModel.bulkUpdateProducts(
        productIds,
        updates
      );
      res.json({
        message: `${result.success} products updated successfully`,
        success: result.success,
        failed: result.failed,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * DELETE /api/admin/products/:id
 * Delete product (with validation for orders)
 */
router.delete("/:id", validateProductDeletion, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const db = (await import("../../config/db.js")).default;
    const [orderItems] = await db.execute(
      "SELECT COUNT(*) as count FROM order_items WHERE product_id = ?",
      [productId]
    );

    if (orderItems[0].count > 0) {
      return res.status(400).json({
        message:
          "Cannot delete product that has been ordered. Consider setting stock to 0 instead.",
      });
    }

    const deleted = await productModel.deleteProduct(productId);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/products/bulk-delete
 * Bulk delete products
 */
router.post(
  "/bulk-delete",
  validateBulkOperation,
  async (req, res) => {
    try {
      const { productIds } = req.body;
      const result = await bulkOperationsModel.bulkDeleteProducts(productIds);
      res.json({
        message: `${result.success} products deleted successfully`,
        success: result.success,
        failed: result.failed,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * PUT /api/admin/products/:id/out-of-stock
 * Mark product as out of stock
 */
router.put("/:id/out-of-stock", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updated = await productModel.updateProduct(productId, { stock: 0 });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/products/bulk-stock-update
 * Bulk update stock levels
 */
router.post("/bulk-stock-update", async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res
        .status(400)
        .json({ message: "updates must be a non-empty array" });
    }

    const result = await bulkOperationsModel.bulkUpdateStock(updates);
    res.json({
      message: `${result.success} products updated successfully`,
      success: result.success,
      failed: result.failed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
