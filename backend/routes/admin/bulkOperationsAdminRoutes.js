
import express from "express";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";

const router = express.Router();

/**
 * POST /api/admin/bulk/delete
 * Generic bulk delete operation
 */
router.post("/delete", async (req, res) => {
  try {
    const { resource, ids } = req.body;
    if (!resource || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Resource and an array of IDs are required" });
    }

    const result = await bulkOperationsModel.bulkDelete(resource, ids);
    res.json({
      message: `${result.success} ${resource}(s) deleted successfully`,
      success: result.success,
      failed: result.failed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
