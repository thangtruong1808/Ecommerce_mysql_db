
import express from "express";
import * as productViewModel from "../../models/productViewModel.js";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";
import { validateBulkOperation } from "../../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/product-views
 * Get all product views with pagination and filters
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await productViewModel.getAllProductViews({ page, limit });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/admin/product-views/:id
 * Delete a product view
 */
router.delete("/:id", async (req, res) => {
  try {
    const viewId = parseInt(req.params.id);
    const deleted = await productViewModel.deleteProductView(viewId);
    if (!deleted) {
      return res.status(404).json({ message: "Product view not found" });
    }
    res.json({ message: "Product view deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/product-views/bulk-delete
 * Bulk delete product views
 */
router.post(
  "/bulk-delete",
  validateBulkOperation,
  async (req, res) => {
    try {
      const { productViewIds } = req.body;
      const result = await bulkOperationsModel.bulkDeleteProductViews(
        productViewIds
      );
      res.json({
        message: `${result.success} product views deleted successfully`,
        success: result.success,
        failed: result.failed,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
