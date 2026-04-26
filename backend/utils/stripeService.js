import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("STRIPE_SECRET_KEY is not configured. Stripe payments are disabled.");
}

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-03-31.basil",
    })
  : null;

export const getStripeClient = () => {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }
  return stripe;
};
