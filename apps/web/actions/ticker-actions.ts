"use server";

import { db, TickerItem } from "@lvdi/database";

const SIDEBAR_COUNT = 3;
const ITEMS_PER_SIDEBAR = 5;
// A source can appear once per sidebar, never twice within the same one.
const MAX_PER_SOURCE = SIDEBAR_COUNT;

/**
 * Latest curated wire headlines for the homepage sidebars — real titles
 * linking out to their original source, populated by the daily cron
 * (app/api/cron/ticker/route.ts). No auth required, this is public content.
 *
 * Returns SIDEBAR_COUNT groups of ITEMS_PER_SIDEBAR items each. Capping
 * items per source globally isn't enough on its own: a source could still
 * land 3 times inside the *same* sidebar if the caller just slices a flat
 * "most recent" list into groups. This assigns items directly to whichever
 * sidebar doesn't already carry that source, so no sidebar ever repeats a
 * source — verified against a real screenshot showing the same outlet
 * three times in one sidebar before this fix.
 */
export async function getTickerItems(): Promise<TickerItem[][]> {
  const total = SIDEBAR_COUNT * ITEMS_PER_SIDEBAR;
  const candidates = await db.tickerItem.findMany({
    take: total * 6,
    orderBy: { publishedAt: "desc" },
  });

  const bySource = new Map<string, TickerItem[]>();
  for (const item of candidates) {
    const bucket = bySource.get(item.sourceName) ?? [];
    if (bucket.length < MAX_PER_SOURCE) bucket.push(item);
    bySource.set(item.sourceName, bucket);
  }

  // Interleave round-robin across sources (in recency order) so freshness
  // is mixed rather than front-loading each source's newest item first.
  const buckets = [...bySource.values()];
  const interleaved: TickerItem[] = [];
  for (let round = 0; round < MAX_PER_SOURCE; round++) {
    for (const bucket of buckets) {
      if (round < bucket.length) interleaved.push(bucket[round]);
    }
  }

  const sidebars: TickerItem[][] = Array.from(
    { length: SIDEBAR_COUNT },
    () => []
  );

  for (const item of interleaved) {
    const eligible = sidebars
      .map((sidebar, index) => ({ sidebar, index }))
      .filter(
        ({ sidebar }) =>
          sidebar.length < ITEMS_PER_SIDEBAR &&
          !sidebar.some((existing) => existing.sourceName === item.sourceName)
      );

    if (eligible.length === 0) continue;

    const target = eligible.reduce((smallest, current) =>
      current.sidebar.length < smallest.sidebar.length ? current : smallest
    );
    target.sidebar.push(item);

    if (sidebars.every((sidebar) => sidebar.length >= ITEMS_PER_SIDEBAR)) break;
  }

  return sidebars;
}
