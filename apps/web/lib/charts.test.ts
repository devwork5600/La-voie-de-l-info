import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildBuckets, countByBucket } from "./charts";

// Wednesday, July 8th 2026, 15:30 local time.
const NOW = new Date(2026, 6, 8, 15, 30);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("buildBuckets", () => {
  it("returns exactly the requested number of buckets", () => {
    expect(buildBuckets("daily", 7)).toHaveLength(7);
    expect(buildBuckets("weekly", 4)).toHaveLength(4);
    expect(buildBuckets("monthly", 3)).toHaveLength(3);
  });

  it("builds daily buckets one calendar day apart, ending on today at midnight", () => {
    const buckets = buildBuckets("daily", 3);

    expect(buckets.map((b) => b.start.toDateString())).toEqual([
      new Date(2026, 6, 6).toDateString(),
      new Date(2026, 6, 7).toDateString(),
      new Date(2026, 6, 8).toDateString(),
    ]);
    expect(buckets[2].start.getHours()).toBe(0);
    expect(buckets[2].start.getMinutes()).toBe(0);
  });

  it("builds weekly buckets aligned to Monday", () => {
    const buckets = buildBuckets("weekly", 2);

    expect(buckets.every((b) => b.start.getDay() === 1)).toBe(true);
    expect(buckets[1].start.toDateString()).toBe(
      new Date(2026, 6, 6).toDateString()
    );
    expect(buckets[0].start.toDateString()).toBe(
      new Date(2026, 5, 29).toDateString()
    );
  });

  it("builds monthly buckets on the 1st of consecutive months", () => {
    const buckets = buildBuckets("monthly", 3);

    expect(buckets.every((b) => b.start.getDate() === 1)).toBe(true);
    expect(buckets.map((b) => b.start.getMonth())).toEqual([4, 5, 6]); // May, June, July
  });

  it("gives daily buckets a short day/month label and monthly buckets a month/year label", () => {
    const [dailyBucket] = buildBuckets("daily", 1);
    const [monthlyBucket] = buildBuckets("monthly", 1);

    expect(dailyBucket.label).not.toMatch(/\d{4}/); // no full year in a daily label
    expect(monthlyBucket.label).toMatch(/\d{2}/); // has a 2-digit year
  });
});

describe("countByBucket", () => {
  it("counts each date into its correct daily bucket", () => {
    const buckets = buildBuckets("daily", 3); // Jul 6, 7, 8
    const dates = [
      new Date(2026, 6, 6, 10),
      new Date(2026, 6, 7, 5),
      new Date(2026, 6, 7, 20),
      new Date(2026, 6, 8, 1),
    ];

    const result = countByBucket(dates, buckets, "daily");

    expect(result.map((r) => r.count)).toEqual([1, 2, 1]);
  });

  it("excludes dates before the first bucket", () => {
    const buckets = buildBuckets("daily", 2); // Jul 7, 8
    const dates = [new Date(2026, 6, 1)];

    const result = countByBucket(dates, buckets, "daily");

    expect(result.reduce((sum, r) => sum + r.count, 0)).toBe(0);
  });

  it("excludes dates on/after the boundary of the next bucket", () => {
    const buckets = buildBuckets("daily", 2); // Jul 7, 8
    const dates = [
      new Date(2026, 6, 7, 23, 59, 59),
      new Date(2026, 6, 8, 0, 0, 0),
    ];

    const result = countByBucket(dates, buckets, "daily");

    expect(result[0].count).toBe(1); // 23:59:59 on the 7th
    expect(result[1].count).toBe(1); // exactly midnight on the 8th
  });

  it("sums to the total number of in-range dates across all buckets", () => {
    const buckets = buildBuckets("monthly", 6);
    const dates = Array.from(
      { length: 50 },
      (_, i) => new Date(2025, 11, (i % 28) + 1)
    );
    const inRange = dates.filter((d) => d >= buckets[0].start);

    const result = countByBucket(dates, buckets, "monthly");

    expect(result.reduce((sum, r) => sum + r.count, 0)).toBe(inRange.length);
  });

  it("returns one result entry per bucket, all zero when there are no dates", () => {
    const buckets = buildBuckets("weekly", 5);

    const result = countByBucket([], buckets, "weekly");

    expect(result).toHaveLength(5);
    expect(result.every((r) => r.count === 0)).toBe(true);
  });
});
