import { db } from "@lvdi/database";
import { headers } from "next/headers";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

// Stripe timestamps are unix seconds; convert to a Date, or null if absent.
const parseStripeDate = (dateVal: number | null | undefined): Date | null => {
  if (!dateVal) return null;
  const parsed = new Date(dateVal * 1000);
  return isNaN(parsed.getTime()) ? null : parsed;
};

// current_period_start/end live on the subscription's items in recent
// Stripe API versions, not on the subscription object itself.
const getCurrentPeriodStart = (subscription: Stripe.Subscription) =>
  subscription.items.data[0]?.current_period_start ?? subscription.start_date;

async function resolveUserIdFromCustomer(
  customerId: string | Stripe.Customer | Stripe.DeletedCustomer
): Promise<string | undefined> {
  const id = typeof customerId === "string" ? customerId : customerId.id;
  const customer = await stripe.customers.retrieve(id);

  if (customer.deleted || !customer.email) return undefined;

  const user = await db.user.findUnique({ where: { email: customer.email } });
  return user?.id;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          let userId: string | undefined =
            session.metadata?.userId || subscription.metadata?.userId;

          if (!userId && subscription.customer) {
            userId = await resolveUserIdFromCustomer(subscription.customer);
          }

          if (userId) {
            const newSub = await db.subscription.create({
              data: {
                status: "ACTIVE",
                providerId: subscription.id,
                customerId:
                  typeof subscription.customer === "string"
                    ? subscription.customer
                    : subscription.customer.id,
                planId: subscription.items.data[0]?.price.id,
                startedAt: parseStripeDate(getCurrentPeriodStart(subscription)),
              },
            });

            await db.user.update({
              where: { id: userId },
              data: {
                isSubscribed: true,
                subscriptionId: newSub.id,
              },
            });
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;

        const existingSub = await db.subscription.findFirst({
          where: { providerId: subscription.id },
        });

        if (existingSub) {
          const isCancelledOrScheduled =
            subscription.status === "canceled" ||
            subscription.cancel_at_period_end === true;

          let status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING" =
            "PENDING";

          if (isCancelledOrScheduled) {
            status = "CANCELLED";
          } else if (
            subscription.status === "active" ||
            subscription.status === "trialing"
          ) {
            status = "ACTIVE";
          } else if (
            subscription.status === "past_due" ||
            subscription.status === "unpaid"
          ) {
            status = "EXPIRED";
          }

          const updatedSub = await db.subscription.update({
            where: { id: existingSub.id },
            data: {
              status,
              planId: subscription.items.data[0]?.price.id,
              startedAt: parseStripeDate(getCurrentPeriodStart(subscription)),
              cancelledAt: isCancelledOrScheduled
                ? (parseStripeDate(subscription.canceled_at) ?? new Date())
                : parseStripeDate(subscription.canceled_at),
            },
          });

          let userId: string | undefined = subscription.metadata?.userId;
          if (!userId && subscription.customer) {
            userId = await resolveUserIdFromCustomer(subscription.customer);
          }

          if (userId) {
            await db.user.update({
              where: { id: userId },
              data: {
                isSubscribed: status === "ACTIVE",
                subscriptionId: updatedSub.id,
              },
            });
          } else {
            await db.user.updateMany({
              where: { subscriptionId: existingSub.id },
              data: { isSubscribed: status === "ACTIVE" },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        const existingSub = await db.subscription.findFirst({
          where: { providerId: subscription.id },
        });

        if (existingSub) {
          await db.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: "CANCELLED",
              cancelledAt: new Date(),
            },
          });

          let userId: string | undefined = subscription.metadata?.userId;
          if (!userId && subscription.customer) {
            userId = await resolveUserIdFromCustomer(subscription.customer);
          }

          if (userId) {
            await db.user.update({
              where: { id: userId },
              data: { isSubscribed: false },
            });
          } else {
            await db.user.updateMany({
              where: { subscriptionId: existingSub.id },
              data: { isSubscribed: false },
            });
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
