
import express from "express";
import * as commentModel from "../../models/commentModel.js";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";
import { validateBulkOperation } from "../../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/comments
 * Get all comments with pagination, search, and sorting
 */
router.get("/", async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      productId,
      userId,
      isApproved,
      sortBy,
      sortOrder,
    } = req.query;
    let isApprovedFilter = null;
    if (isApproved !== undefined && isApproved !== "") {
      isApprovedFilter = isApproved === "true";
    }
    const result = await commentModel.getAllCommentsPaginated({
      page,
      limit,
      search: search ? String(search).trim() : "",
      productId,
      userId,
      isApproved: isApprovedFilter,
      sortBy,
      sortOrder,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message || "No comments found matching your search",
      comments: [],
      pagination: {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        total: 0,
        pages: 1,
      },
    });
  }
});

/**
 * DELETE /api/admin/comments/:id
 * Delete comment
 */
router.delete("/:id", async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    const deleted = await commentModel.deleteComment(
      commentId,
      req.user.id,
      true
    );

    if (!deleted) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/comments/bulk-approve
 * Bulk approve comments
 */
router.post(
  "/bulk-approve",
  validateBulkOperation,
  async (req, res) => {
    try {
      const { commentIds } = req.body;
      const result = await bulkOperationsModel.bulkApproveComments(commentIds);
      res.json({
        message: `${result.success} comments approved successfully`,
        success: result.success,
        failed: result.failed,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
