"use server";

import { db } from "@lvdi/database";

const MAX_PER_SOURCE = 3;

/**
 * Latest curated wire headlines for the homepage sidebar — real titles
 * linking out to their original source, populated by the daily cron
 * (app/api/cron/ticker/route.ts). No auth required, this is public content.
 *
 * dedupeByTitle (in the cron) only catches identical titles — it doesn't
 * stop a single prolific outlet (e.g. a financial wire that publishes many
 * short, individually-distinct headlines) from dominating a plain
 * "most recent" list. Selecting from a larger candidate pool while capping
 * how many items any one source can contribute keeps the sidebar varied.
 */
export async function getTickerItems(limit = 18) {
  const candidates = await db.tickerItem.findMany({
    take: limit * 4,
    orderBy: { publishedAt: "desc" },
  });

  const perSourceCount = new Map<string, number>();
  const selected = [];

  for (const item of candidates) {
    const count = perSourceCount.get(item.sourceName) ?? 0;
    if (count >= MAX_PER_SOURCE) continue;

    selected.push(item);
    perSourceCount.set(item.sourceName, count + 1);

    if (selected.length >= limit) break;
  }

  return selected;
}
