"use server";

import { createHash } from "crypto";

import { db } from "@lvdi/database";
import { headers } from "next/headers";

const DAILY_LIMIT = 5;

interface VisitStatus {
  allowed: boolean;
  remaining: number;
}

/**
 * Fingerprints an anonymous visitor from IP + user-agent, since there's no
 * session to key off of.
 */
async function getVisitorFingerprint() {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for") ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";
  return createHash("sha256").update(`${ip}-${userAgent}`).digest("hex");
}

async function checkAndRecord(
  fingerprint: string,
  articleId: string,
  userId?: string
): Promise<VisitStatus> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Re-reading an article already counted today doesn't cost another slot.
  const existingVisit = await db.visitorVisit.findFirst({
    where: { fingerprint, articleId, createdAt: { gte: startOfDay } },
  });

  if (existingVisit) {
    return { allowed: true, remaining: DAILY_LIMIT };
  }

  const dailyVisits = await db.visitorVisit.findMany({
    where: { fingerprint, createdAt: { gte: startOfDay } },
    select: { articleId: true },
  });

  const uniqueArticlesCount = new Set(dailyVisits.map((v) => v.articleId)).size;

  if (uniqueArticlesCount >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await db.visitorVisit.create({
    data: { fingerprint, articleId, ...(userId ? { userId } : {}) },
  });

  return { allowed: true, remaining: DAILY_LIMIT - (uniqueArticlesCount + 1) };
}

/**
 * Checks (and records) a visit from an anonymous visitor. Non-subscribers
 * get DAILY_LIMIT unique articles per day.
 */
export async function checkAndRecordVisitorVisit(articleId: string) {
  const fingerprint = await getVisitorFingerprint();
  return checkAndRecord(fingerprint, articleId);
}

/**
 * Checks (and records) a visit from a logged-in, non-subscribed user.
 */
export async function checkAndRecordUserVisit(
  userId: string,
  articleId: string
) {
  return checkAndRecord(`user:${userId}`, articleId, userId);
}
