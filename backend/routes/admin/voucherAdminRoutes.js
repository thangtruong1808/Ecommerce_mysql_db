
import express from "express";
import * as voucherModel from "../../models/voucherModel.js";

const router = express.Router();

/**
 * POST /api/admin/vouchers/quick-create
 * Quick create voucher from dashboard
 */
router.post("/quick-create", async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_purchase_amount = 0,
      max_discount_amount = null,
      start_date,
      end_date,
      usage_limit_per_user = 1,
      total_usage_limit = null,
      is_active = true,
    } = req.body;

    if (
      !code ||
      !discount_type ||
      !discount_value ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: code, discount_type, discount_value, start_date, end_date",
      });
    }

    if (!["percentage", "fixed"].includes(discount_type)) {
      return res
        .status(400)
        .json({ message: 'discount_type must be "percentage" or "fixed"' });
    }

    const existing = await voucherModel.getVoucherByCode(code);
    if (existing) {
      return res.status(400).json({ message: "Voucher code already exists" });
    }

    const voucherId = await voucherModel.createVoucher({
      code,
      description,
      discount_type,
      discount_value: parseFloat(discount_value),
      min_purchase_amount: parseFloat(min_purchase_amount),
      max_discount_amount: max_discount_amount
        ? parseFloat(max_discount_amount)
        : null,
      start_date,
      end_date,
      usage_limit_per_user: parseInt(usage_limit_per_user),
      total_usage_limit: total_usage_limit ? parseInt(total_usage_limit) : null,
      is_active,
    });

    const voucher = await voucherModel.getVoucherById(voucherId);
    res.status(201).json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/vouchers/:id/status
 * Activate/deactivate voucher
 */
router.put("/:id/status", async (req, res) => {
  try {
    const voucherId = parseInt(req.params.id);
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({ message: "isActive is required" });
    }

    const updated = await voucherModel.updateVoucher(voucherId, {
      is_active: isActive,
    });
    if (!updated) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
