import Stripe from "stripe";

const STRIPE_API_KEY = process.env.STRIPE_API_KEY!

export const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});