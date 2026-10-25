import type { Request, Response } from "express";
import express from "express";
import * as productViewModel from "../../models/productViewModel.js";

const router = express.Router();

/**
 * GET /api/admin/product-views
 * Get all product views with pagination and filters
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 20;
    const search = typeof req.query.search === "string" ? req.query.search : null;
    const userType = req.query.userType === "authenticated" || req.query.userType === "guest"
      ? req.query.userType
      : null;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "viewed_at";
    const sortOrder = typeof req.query.sortOrder === "string" ? req.query.sortOrder : "desc";
    const result = await productViewModel.getAllProductViews({
      page,
      limit,
      search,
      userType,
      sortBy,
      sortOrder,
    });
    res.json(result);
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

/**
 * POST /api/admin/product-views/bulk-delete
 * Bulk delete product views
 */
router.post("/bulk-delete", async (req: Request, res: Response) => {
  try {
    const { productViewIds } = req.body as { productViewIds?: unknown };
    if (!Array.isArray(productViewIds) || productViewIds.length === 0) {
      return res.status(400).json({ message: "IDs must be a non-empty array" });
    }
    const ids = productViewIds.map((id) => parseInt(String(id), 10));
    if (!ids.every((id) => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({ message: "All IDs must be positive integers" });
    }
    const deleted = await productViewModel.bulkDeleteProductViews(ids);
    res.json({
      message: `${deleted} product views deleted successfully`,
      success: deleted,
      failed: ids.length - deleted,
    });
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

export default router;
