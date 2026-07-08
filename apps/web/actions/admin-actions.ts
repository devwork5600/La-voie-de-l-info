"use server";

import { db } from "@lvdi/database";
import { revalidatePath } from "next/cache";

import { NewsletterTemplate } from "@/components/email-template/NewsletterTemplate";
import { getUser } from "@/lib/auth/auth-session";
import {
  buildBuckets,
  countByBucket,
  ChartRange,
  RANGE_BUCKET_COUNTS,
} from "@/lib/charts";
import { resend } from "@/lib/resend";

async function ensureAdmin() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Accès réservé aux administrateurs.");
  }
  return user;
}

/**
 * Global stats shown at the top of the admin charts page.
 */
export async function getAdminOverviewStats() {
  await ensureAdmin();

  const [userCount, subscriberCount, articleCount, totalVisits] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { isSubscribed: true } }),
      db.article.count(),
      db.visitorVisit.count(),
    ]);

  return { userCount, subscriberCount, articleCount, totalVisits };
}

export async function getVisitorChartData(range: ChartRange = "daily") {
  await ensureAdmin();

  const buckets = buildBuckets(range, RANGE_BUCKET_COUNTS[range]);
  const visits = await db.visitorVisit.findMany({
    where: { createdAt: { gte: buckets[0].start } },
    select: { createdAt: true },
  });

  return countByBucket(
    visits.map((v) => v.createdAt),
    buckets,
    range
  );
}

export async function getSubscriptionChartData(range: ChartRange = "monthly") {
  await ensureAdmin();

  const buckets = buildBuckets(range, RANGE_BUCKET_COUNTS[range]);
  const subscriptions = await db.subscription.findMany({
    where: { createdAt: { gte: buckets[0].start } },
    select: { createdAt: true },
  });

  return countByBucket(
    subscriptions.map((s) => s.createdAt),
    buckets,
    range
  );
}

export async function getNewUsersChartData(range: ChartRange = "monthly") {
  await ensureAdmin();

  const buckets = buildBuckets(range, RANGE_BUCKET_COUNTS[range]);
  const users = await db.user.findMany({
    where: { createdAt: { gte: buckets[0].start } },
    select: { createdAt: true },
  });

  return countByBucket(
    users.map((u) => u.createdAt),
    buckets,
    range
  );
}

/**
 * Users who have authored at least one article, for the admin articles filter.
 */
export async function getArticleAuthors() {
  await ensureAdmin();

  return db.user.findMany({
    where: { articles: { some: {} } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated user list for the admin users page.
 */
export async function getUsers({ page = 1, limit = 20 }: GetUsersParams = {}) {
  await ensureAdmin();

  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    db.user.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isSubscribed: true,
        createdAt: true,
      },
    }),
    db.user.count(),
  ]);

  return {
    users,
    nextPage: skip + users.length < totalCount ? page + 1 : undefined,
    totalCount,
  };
}

/**
 * Promotes a regular user to the AUTHOR role.
 */
export async function promoteToAuthor(userId: string) {
  await ensureAdmin();

  const target = await db.user.findUnique({ where: { id: userId } });

  if (!target) {
    return { success: false, error: "Utilisateur introuvable." };
  }

  if (target.role !== "USER") {
    return { success: false, error: "Cet utilisateur ne peut pas être promu." };
  }

  try {
    await db.user.update({ where: { id: userId }, data: { role: "AUTHOR" } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to promote user:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la promotion.",
    };
  }
}

/**
 * Users who opted in to the newsletter.
 */
export async function getNewsletterSubscribers() {
  await ensureAdmin();

  return db.user.findMany({
    where: { isSubscribeToNewsletter: true },
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Sends a newsletter to every opted-in user and records it in the Newsletter table.
 */
export async function sendNewsletter(subject: string, content: string) {
  await ensureAdmin();

  const subscribers = await db.user.findMany({
    where: { isSubscribeToNewsletter: true },
    select: { id: true, email: true },
  });

  if (subscribers.length === 0) {
    return { success: false, message: "Aucun abonné à la newsletter." };
  }

  const emailFrom = process.env.EMAIL_FROM;
  if (!emailFrom) {
    throw new Error(
      "La variable d'environnement EMAIL_FROM n'est pas définie."
    );
  }

  try {
    await db.newsletter.create({
      data: {
        title: subject,
        content,
        recipients: {
          connect: subscribers.map((sub) => ({ id: sub.id })),
        },
      },
    });

    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        resend.emails.send({
          from: emailFrom,
          to: sub.email,
          subject,
          react: NewsletterTemplate({ subject, content }),
        })
      )
    );

    const failures = results.filter((r) => r.status === "rejected");

    revalidatePath("/admin/newsletter");

    return {
      success: failures.length === 0,
      message: `${subscribers.length - failures.length} e-mail(s) envoyé(s).${
        failures.length > 0 ? ` ${failures.length} échec(s).` : ""
      }`,
    };
  } catch (error) {
    console.error("Failed to send newsletter:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'envoi.",
    };
  }
}
