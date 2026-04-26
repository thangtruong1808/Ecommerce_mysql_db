import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

const response = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  try {
    const signature =
      event.headers?.["stripe-signature"] || event.headers?.["Stripe-Signature"];
    if (!signature) {
      return response(400, { message: "Missing stripe-signature header" });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return response(500, { message: "STRIPE_WEBHOOK_SECRET is not configured" });
    }

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      return response(400, { message: "Invalid webhook signature" });
    }

    const paymentIntent = stripeEvent?.data?.object;
    if (!paymentIntent?.id) {
      return response(200, { message: "Event ignored (missing payment intent id)" });
    }

    if (
      stripeEvent.type !== "payment_intent.succeeded" &&
      stripeEvent.type !== "payment_intent.payment_failed" &&
      stripeEvent.type !== "payment_intent.canceled"
    ) {
      return response(200, { message: `Event ignored (${stripeEvent.type})` });
    }

    const backendUrl = process.env.BACKEND_INTERNAL_URL;
    const internalSecret = process.env.LAMBDA_WEBHOOK_INTERNAL_SECRET;

    if (!backendUrl || !internalSecret) {
      return response(500, {
        message:
          "BACKEND_INTERNAL_URL or LAMBDA_WEBHOOK_INTERNAL_SECRET is not configured",
      });
    }

    const confirmResponse = await fetch(`${backendUrl}/api/payments/lambda/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-lambda-webhook-secret": internalSecret,
      },
      body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
    });

    if (!confirmResponse.ok) {
      const errorText = await confirmResponse.text();
      return response(502, {
        message: "Backend confirmation failed",
        status: confirmResponse.status,
        details: errorText,
      });
    }

    return response(200, { message: "Webhook processed successfully" });
  } catch (error) {
    return response(500, { message: error.message });
  }
};

