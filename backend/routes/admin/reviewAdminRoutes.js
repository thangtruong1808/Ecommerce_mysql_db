
import express from "express";
import * as reviewModel from "../../models/reviewModel.js";
import * as bulkOperationsModel from "../../models/bulkOperationsModel.js";
import { validateBulkOperation } from "../../middleware/validationMiddleware.js";

const router = express.Router();

/**
 * GET /api/admin/reviews
 * Get all reviews with pagination, search, and filters
 */
router.get("/", async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search ? String(req.query.search).trim() : "",
      productId: req.query.productId ? parseInt(req.query.productId) : null,
      userId: req.query.userId ? parseInt(req.query.userId) : null,
      rating: req.query.rating ? parseInt(req.query.rating) : null,
    };
    const result = await reviewModel.getAllReviews(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message || "No reviews found matching your search",
      reviews: [],
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
 * PUT /api/admin/reviews/:id
 * Update review (rating, comment)
 */
router.put("/:id", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (isNaN(reviewId) || reviewId <= 0) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await reviewModel.getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const updated = await reviewModel.updateReview(reviewId, updateData);
    if (!updated) {
      return res.status(400).json({ message: "Failed to update review" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/reviews/:id/approve
 * Approve review
 */
router.put("/:id/approve", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = await reviewModel.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      ...review,
      message: "Review approved (requires is_approved field in reviews table)",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/reviews/:id/reject
 * Reject review
 */
router.put("/:id/reject", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = await reviewModel.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      ...review,
      message: "Review rejected (requires is_approved field in reviews table)",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/admin/reviews/:id
 * Delete review
 */
router.delete("/:id", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const deleted = await reviewModel.deleteReview(reviewId);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/reviews/bulk-approve
 * Bulk approve reviews
 */
router.post(
  "/bulk-approve",
  validateBulkOperation,
  async (req, res) => {
    try {
      const { reviewIds } = req.body;
      const result = await bulkOperationsModel.bulkApproveReviews(reviewIds);
      res.json({
        message:
          result.message || `${result.success} reviews approved successfully`,
        success: result.success,
        failed: result.failed,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
