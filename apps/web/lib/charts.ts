export type ChartRange = "daily" | "weekly" | "monthly";

export const RANGE_BUCKET_COUNTS: Record<ChartRange, number> = {
  daily: 30,
  weekly: 12,
  monthly: 12,
};

export const RANGE_LABELS: Record<ChartRange, string> = {
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  monthly: "Mensuel",
};

interface Bucket {
  start: Date;
  label: string;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as the first day of the week
  d.setDate(d.getDate() + diff);
  return d;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addRangeUnit(date: Date, range: ChartRange) {
  const d = new Date(date);
  if (range === "daily") d.setDate(d.getDate() + 1);
  else if (range === "weekly") d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

/**
 * Builds `count` consecutive buckets of the given range, ending on the current one.
 */
export function buildBuckets(range: ChartRange, count: number): Bucket[] {
  const now = new Date();
  const buckets: Bucket[] = [];

  for (let i = count - 1; i >= 0; i--) {
    let start: Date;

    if (range === "daily") {
      start = startOfDay(now);
      start.setDate(start.getDate() - i);
    } else if (range === "weekly") {
      start = startOfWeek(now);
      start.setDate(start.getDate() - i * 7);
    } else {
      start = startOfMonth(now);
      start.setMonth(start.getMonth() - i);
    }

    const label =
      range === "monthly"
        ? start.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" })
        : start.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

    buckets.push({ start, label });
  }

  return buckets;
}

/**
 * Counts how many of the given dates fall into each bucket's [start, next bucket's start) window.
 */
export function countByBucket(
  dates: Date[],
  buckets: Bucket[],
  range: ChartRange
) {
  return buckets.map((bucket, index) => {
    const nextStart =
      index + 1 < buckets.length
        ? buckets[index + 1].start
        : addRangeUnit(bucket.start, range);

    const count = dates.filter(
      (date) => date >= bucket.start && date < nextStart
    ).length;

    return { label: bucket.label, count };
  });
}
