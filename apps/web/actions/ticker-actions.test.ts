import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();

vi.mock("@lvdi/database", () => ({
  db: { tickerItem: { findMany: (...args: unknown[]) => findMany(...args) } },
}));

const { getTickerItems } = await import("./ticker-actions");

function item(id: string, sourceName: string) {
  return { id, sourceName, title: `title-${id}`, sourceUrl: `https://x/${id}` };
}

beforeEach(() => {
  findMany.mockReset();
});

describe("getTickerItems", () => {
  it("never repeats a source within the same sidebar — the real bug found in production", async () => {
    // 5 Investing French items came back in a single sidebar in production
    // before this fix, because a global per-source cap doesn't stop items
    // from the same source landing next to each other in a flat list that
    // then gets sliced into groups.
    findMany.mockResolvedValue([
      item("1", "Investing French"),
      item("2", "Investing French"),
      item("3", "Investing French"),
      item("4", "Radio France"),
      item("5", "Sudouest"),
      item("6", "Le Figaro"),
      item("7", "Lagefi"),
      item("8", "Lagefi"),
      item("9", "Lepetitjournal"),
      item("10", "Boursorama"),
      item("11", "Franceinfo"),
      item("12", "Developpez.com"),
      item("13", "Linternaute"),
      item("14", "Le10sport"),
      item("15", "Ici Par France Bleu"),
    ]);

    const sidebars = await getTickerItems();

    expect(sidebars).toHaveLength(3);
    for (const sidebar of sidebars) {
      const sourceNames = sidebar.map((i) => i.sourceName);
      expect(new Set(sourceNames).size).toBe(sourceNames.length);
    }
  });

  it("fills each sidebar to 5 items when enough distinct sources are available", async () => {
    findMany.mockResolvedValue(
      Array.from({ length: 20 }, (_, i) => item(`${i}`, `Source ${i % 15}`))
    );

    const sidebars = await getTickerItems();

    for (const sidebar of sidebars) {
      expect(sidebar).toHaveLength(5);
    }
  });

  it("requests a candidate pool much larger than the total item count", async () => {
    findMany.mockResolvedValue([]);

    await getTickerItems();

    const take = findMany.mock.calls[0][0].take;
    expect(take).toBeGreaterThan(15);
  });
});
