"use server";

import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/auth-session";
import { stripe } from "@/lib/stripe";

/**
 * Creates a Stripe Checkout session for the subscription product
 * and redirects the user to Stripe's hosted checkout page.
 */
export async function createCheckoutSession() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.isSubscribed) {
    redirect("/user?already_subscribed=1");
  }

  const productId = process.env.STRIPE_PRODUCT_ID;
  if (!productId) {
    throw new Error("STRIPE_PRODUCT_ID is not configured");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Fetch the default price for the product
  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 1,
  });

  if (!prices.data.length) {
    throw new Error("No active price found for the subscription product");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    // Pass user metadata so the webhook can link the subscription to the user
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    customer_email: user.email,
    success_url: `${baseUrl}/user?subscribed=1`,
    cancel_url: `${baseUrl}/subscribe?cancelled=1`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
}

/**
 * Creates a Stripe Billing Portal session so a subscriber can
 * manage or cancel their subscription.
 */
export async function createPortalSession() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Find the customer by email
  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });

  if (!customers.data.length) {
    redirect("/subscribe");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: `${baseUrl}/user`,
  });

  redirect(session.url);
}
