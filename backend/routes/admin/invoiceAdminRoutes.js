
import express from "express";
import * as invoiceModel from "../../models/invoiceModel.js";

const router = express.Router();

/**
 * GET /api/admin/invoices
 * Get all invoices with pagination, search, and filters
 */
router.get("/", async (req, res) => {
  try {
    const filters = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 20,
      search: req.query.search || "",
      paymentStatus: req.query.paymentStatus || null,
      sortBy: req.query.sortBy || "created_at",
      sortOrder: req.query.sortOrder || "desc",
    };
    const result = await invoiceModel.getAllInvoices(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      invoices: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    });
  }
});

/**
 * GET /api/admin/invoices/:id
 * Get invoice details
 */
router.get("/:id", async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id);

    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await invoiceModel.getInvoiceById(invoiceId, null);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/admin/invoices/:id
 * Update invoice (payment status, email sent status)
 */
router.put("/:id", async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id);
    const { payment_status, email_sent } = req.body;

    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await invoiceModel.getInvoiceById(invoiceId, null);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const updateData = {};
    if (payment_status !== undefined)
      updateData.payment_status = payment_status;
    if (email_sent !== undefined)
      updateData.email_sent = email_sent === true || email_sent === "true";

    const updated = await invoiceModel.updateInvoice(invoiceId, updateData);
    if (!updated) {
      return res.status(400).json({ message: "Failed to update invoice" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/admin/invoices/:id
 * Delete invoice (with validation)
 */
router.delete("/:id", async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id);

    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await invoiceModel.getInvoiceById(invoiceId, null);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const deleted = await invoiceModel.deleteInvoice(invoiceId);
    if (!deleted) {
      return res.status(400).json({ message: "Failed to delete invoice" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        message: "Cannot delete invoice. It is referenced by an order.",
      });
    }
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/invoices/:id/resend-email
 * Resend invoice email
 */
router.post("/:id/resend-email", async (req, res) => {
  try {
    const invoiceId = parseInt(req.params.id);

    if (isNaN(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await invoiceModel.getInvoiceById(invoiceId, null);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const { sendInvoiceEmail } = await import("../../utils/emailService.js");
    const emailResult = await sendInvoiceEmail(
      invoice.user_email,
      invoice.user_name || "Customer",
      invoice
    );

    if (emailResult.success) {
      await invoiceModel.markInvoiceEmailSent(invoiceId);
      res.json({
        message: "Invoice email sent successfully",
        invoice: await invoiceModel.getInvoiceById(invoiceId, null),
      });
    } else {
      res.status(500).json({
        message: emailResult.message || "Failed to send invoice email",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/admin/invoices/bulk-delete
 * Bulk delete invoices
 */
router.post("/bulk-delete", async (req, res) => {
  try {
    const { invoiceIds } = req.body;

    if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
      return res.status(400).json({ message: "Invoice IDs array is required" });
    }

    const deleted = [];
    const errors = [];

    for (const invoiceId of invoiceIds) {
      try {
        const id = parseInt(invoiceId);
        if (isNaN(id) || id <= 0) {
          errors.push({ id: invoiceId, error: "Invalid invoice ID" });
          continue;
        }

        const result = await invoiceModel.deleteInvoice(id);
        if (result) {
          deleted.push(id);
        } else {
          errors.push({ id, error: "Invoice not found" });
        }
      } catch (error) {
        if (error.code === "ER_ROW_IS_REFERENCED_2") {
          errors.push({ id: invoiceId, error: "Referenced by order" });
        } else {
          errors.push({ id: invoiceId, error: error.message });
        }
      }
    }

    res.json({
      message: `${deleted.length} invoice(s) deleted successfully`,
      deleted,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
