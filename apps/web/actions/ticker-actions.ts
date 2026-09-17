"use server";

import { db } from "@lvdi/database";

/**
 * Latest curated wire headlines for the homepage sidebar — real titles
 * linking out to their original source, populated by the daily cron
 * (app/api/cron/ticker/route.ts). No auth required, this is public content.
 */
export async function getTickerItems(limit = 12) {
  return db.tickerItem.findMany({
    take: limit,
    orderBy: { publishedAt: "desc" },
  });
}
