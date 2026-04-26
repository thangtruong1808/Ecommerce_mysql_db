import express from "express";
import * as orderModel from "../models/orderModel.js";
import * as invoiceModel from "../models/invoiceModel.js";
import { sendInvoiceEmail } from "../utils/emailService.js";
import { getStripeClient } from "../utils/stripeService.js";

const router = express.Router();

router.get("/config", (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
  if (!publishableKey) {
    return res.status(500).json({ message: "Stripe publishable key is not configured" });
  }
  res.json({ publishableKey });
});

const getInvoicePayload = (order, paymentStatus) => ({
  order_id: order.id,
  user_id: order.user_id,
  subtotal:
    parseFloat(order.total_price) -
    parseFloat(order.tax_price) -
    parseFloat(order.shipping_price),
  tax_amount: parseFloat(order.tax_price),
  shipping_amount: parseFloat(order.shipping_price),
  total_amount: parseFloat(order.total_price),
  payment_method: order.payment_method,
  payment_status: paymentStatus,
  billing_address: {
    address: order.address,
    city: order.city,
    postal_code: order.postal_code,
    country: order.country,
  },
  shipping_address: {
    address: order.address,
    city: order.city,
    postal_code: order.postal_code,
    country: order.country,
  },
});

const finalizeOrderPayment = async (orderId, paymentIntent) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    return;
  }

  if (order.is_paid) {
    return;
  }

  await orderModel.updateOrderPayment(orderId, {
    payment_result_id: paymentIntent.id,
    payment_status: paymentIntent.status,
    payment_update_time: new Date(paymentIntent.created * 1000).toISOString(),
    payment_email:
      paymentIntent.receipt_email ||
      paymentIntent.charges?.data?.[0]?.billing_details?.email ||
      order.user_email,
  });

  const existingInvoice = await invoiceModel.getInvoiceByOrderId(orderId);
  if (existingInvoice) {
    return;
  }

  const invoiceId = await invoiceModel.createInvoice(
    getInvoicePayload(order, paymentIntent.status)
  );
  const createdInvoice = await invoiceModel.getInvoiceById(invoiceId, order.user_id);

  if (createdInvoice && order.user_email) {
    try {
      await sendInvoiceEmail(
        order.user_email,
        order.user_name || "Customer",
        createdInvoice
      );
      await invoiceModel.markInvoiceEmailSent(invoiceId);
    } catch (error) {
      // Keep webhook processing resilient if email sending fails.
    }
  }
};

/**
 * POST /api/payments/lambda/confirm
 * Finalize payment from trusted Lambda webhook handler.
 */
router.post("/lambda/confirm", async (req, res) => {
  try {
    const expectedSecret = process.env.LAMBDA_WEBHOOK_INTERNAL_SECRET;
    if (!expectedSecret) {
      return res.status(500).json({ message: "LAMBDA_WEBHOOK_INTERNAL_SECRET is not configured" });
    }

    const providedSecret = req.headers["x-lambda-webhook-secret"];
    if (providedSecret !== expectedSecret) {
      return res.status(401).json({ message: "Unauthorized lambda webhook request" });
    }

    const paymentIntentId = req.body?.payment_intent_id;
    if (!paymentIntentId) {
      return res.status(400).json({ message: "payment_intent_id is required" });
    }

    const stripe = getStripeClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const orderId = parseInt(paymentIntent.metadata?.orderId, 10);

    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: "Payment intent missing order metadata" });
    }

    if (paymentIntent.status === "succeeded") {
      await finalizeOrderPayment(orderId, paymentIntent);
      return res.json({ message: "Payment finalized from lambda", orderId });
    }

    if (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "canceled"
    ) {
      await orderModel.updateOrderPaymentStatus(orderId, {
        payment_result_id: paymentIntent.id,
        payment_status: paymentIntent.status,
        payment_update_time: new Date().toISOString(),
        payment_email:
          paymentIntent.receipt_email ||
          paymentIntent.charges?.data?.[0]?.billing_details?.email ||
          null,
      });
      return res.json({ message: "Payment status updated from lambda", orderId });
    }

    return res.json({ message: "Payment intent status ignored", status: paymentIntent.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const stripe = getStripeClient();
      const signature = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        return res.status(500).send("Webhook secret is not configured");
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
      } catch (error) {
        return res.status(400).send(`Webhook signature verification failed`);
      }

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = parseInt(paymentIntent.metadata?.orderId, 10);

        if (!Number.isNaN(orderId)) {
          await finalizeOrderPayment(orderId, paymentIntent);
        }
      } else if (
        event.type === "payment_intent.payment_failed" ||
        event.type === "payment_intent.canceled"
      ) {
        const paymentIntent = event.data.object;
        const orderId = parseInt(paymentIntent.metadata?.orderId, 10);

        if (!Number.isNaN(orderId)) {
          await orderModel.updateOrderPaymentStatus(orderId, {
            payment_result_id: paymentIntent.id,
            payment_status: paymentIntent.status,
            payment_update_time: new Date().toISOString(),
            payment_email:
              paymentIntent.receipt_email ||
              paymentIntent.charges?.data?.[0]?.billing_details?.email ||
              null,
          });
        }
      }

      res.json({ received: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
