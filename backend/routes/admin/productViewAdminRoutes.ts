
import type { Request, Response, NextFunction } from "express";
import express from "express";
import * as productViewModel from "../../models/productViewModel.js";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";
import { validateBulkOperation } from "../../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/product-views
 * Get all product views with pagination and filters
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 20;
    const result = await productViewModel.getAllProductViews({ page, limit });
    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * DELETE /api/admin/product-views/:id
 * Delete a product view
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const viewId = parseInt(req.params.id);
    const deleted = await productViewModel.deleteProductView(viewId);
    if (!deleted) {
      return res.status(404).json({ message: "Product view not found" });
    }
    res.json({ message: "Product view deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * POST /api/admin/product-views/bulk-delete
 * Bulk delete product views
 */
router.post(
  "/bulk-delete",
  validateBulkOperation,
  async (req: Request, res: Response) => {
    try {
      const { productViewIds } = req.body;
      const result = await (bulkOperationsModel as any).bulkDeleteProductViews(
        productViewIds
      );
      res.json({
        message: `${result.success} product views deleted successfully`,
        success: result.success,
        failed: result.failed,
      });
    } catch (error: unknown) {
      res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
    }
  }
);

export default router;
