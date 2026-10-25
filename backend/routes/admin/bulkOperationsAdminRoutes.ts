
import type { Request, Response, NextFunction } from "express";
import express from "express";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";

const router = express.Router();

/**
 * POST /api/admin/bulk/delete
 * Generic bulk delete operation
 */
router.post("/delete", async (req: Request, res: Response) => {
  try {
    const { resource, ids } = req.body;
    if (!resource || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Resource and an array of IDs are required" });
    }

    const result = await (bulkOperationsModel as any).bulkDelete(resource, ids);
    res.json({
      message: `${result.success} ${resource}(s) deleted successfully`,
      success: result.success,
      failed: result.failed,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
});

export default router;
