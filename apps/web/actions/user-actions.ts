"use server";

import { db } from "@lvdi/database";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/auth/auth-session";
import { stripe } from "@/lib/stripe";

async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Full account details for the /user page, including a live read of the
 * Stripe subscription (cancel-at-period-end + current period end) since
 * that state isn't fully mirrored locally.
 */
export async function getMyAccount() {
  const user = await requireUser();

  const account = await db.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isSubscribed: true,
      createdAt: true,
      subscription: {
        select: {
          status: true,
          providerId: true,
          planId: true,
          startedAt: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!account) {
    redirect("/login");
  }

  let currentPeriodEnd: Date | null = account.subscription?.expiresAt ?? null;
  let cancelAtPeriodEnd = false;

  if (account.subscription?.providerId) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(
        account.subscription.providerId
      );
      const periodEnd = stripeSub.items.data[0]?.current_period_end;
      currentPeriodEnd = periodEnd
        ? new Date(periodEnd * 1000)
        : currentPeriodEnd;
      cancelAtPeriodEnd = stripeSub.cancel_at_period_end;
    } catch (error) {
      console.error("Failed to fetch live Stripe subscription:", error);
    }
  }

  return { ...account, currentPeriodEnd, cancelAtPeriodEnd };
}

/**
 * Schedules the user's subscription to cancel at the end of the current
 * billing period — they keep full access until then, no immediate refund
 * or access change.
 */
export async function cancelMySubscription() {
  const user = await requireUser();

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { subscription: { select: { providerId: true } } },
  });

  const providerId = dbUser?.subscription?.providerId;

  if (!providerId) {
    return { success: false, error: "Aucun abonnement actif trouvé." };
  }

  try {
    const updated = await stripe.subscriptions.update(providerId, {
      cancel_at_period_end: true,
    });

    const periodEnd = updated.items.data[0]?.current_period_end;

    return {
      success: true,
      currentPeriodEnd: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    };
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'annulation.",
    };
  }
}

/**
 * Permanently deletes the current user's account. Cancels any live Stripe
 * subscription immediately (a deleted account should never keep being
 * billed) and removes the local user + subscription records.
 */
export async function deleteMyAccount() {
  const user = await requireUser();

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: {
      subscriptionId: true,
      subscription: { select: { providerId: true } },
    },
  });

  if (dbUser?.subscription?.providerId) {
    try {
      await stripe.subscriptions.cancel(dbUser.subscription.providerId);
    } catch (error) {
      console.error(
        "Failed to cancel Stripe subscription during account deletion:",
        error
      );
    }
  }

  try {
    await db.$transaction(async (tx) => {
      await tx.user.delete({ where: { id: user.id } });

      if (dbUser?.subscriptionId) {
        await tx.subscription
          .delete({ where: { id: dbUser.subscriptionId } })
          .catch(() => {});
      }
    });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return {
      success: false,
      error:
        "Impossible de supprimer ce compte. Si vous êtes auteur d'articles, contactez un administrateur.",
    };
  }

  return { success: true };
}
