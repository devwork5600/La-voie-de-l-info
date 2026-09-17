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
  it("caps how many items a single source can contribute", async () => {
    findMany.mockResolvedValue([
      item("1", "Investing French"),
      item("2", "Investing French"),
      item("3", "Investing French"),
      item("4", "Investing French"),
      item("5", "Investing French"),
      item("6", "Lagefi"),
      item("7", "Lagefi"),
      item("8", "Sudouest"),
    ]);

    const result = await getTickerItems(6);

    const countBySource = new Map<string, number>();
    for (const r of result) {
      countBySource.set(
        r.sourceName,
        (countBySource.get(r.sourceName) ?? 0) + 1
      );
    }

    expect(countBySource.get("Investing French")).toBe(3);
    expect(countBySource.get("Lagefi")).toBe(2);
    expect(countBySource.get("Sudouest")).toBe(1);
    expect(result).toHaveLength(6);
  });

  it("requests a larger candidate pool than the requested limit", async () => {
    findMany.mockResolvedValue([]);

    await getTickerItems(18);

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: expect.any(Number) })
    );
    const take = findMany.mock.calls[0][0].take;
    expect(take).toBeGreaterThan(18);
  });
});
