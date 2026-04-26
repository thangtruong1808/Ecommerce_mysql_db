import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getShippingQuote } from "../utils/shippingQuoteService.js";

const router = express.Router();

/**
 * POST /api/shipping/quote
 * Return shipping estimate (PAC when configured, fallback otherwise)
 */
router.post("/quote", protect, async (req, res) => {
  try {
    const { subtotal, destinationPostcode, destinationCountry } = req.body || {};

    const quote = await getShippingQuote({
      subtotal,
      destinationPostcode,
      destinationCountry,
    });

    res.json({
      amount: quote.amount,
      service: quote.service,
      source: quote.source,
      estimated_days: quote.estimated_days,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

