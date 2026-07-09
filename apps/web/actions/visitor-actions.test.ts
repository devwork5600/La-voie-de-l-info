import { beforeEach, describe, expect, it, vi } from "vitest";

const findFirst = vi.fn();
const findMany = vi.fn();
const create = vi.fn();

vi.mock("@lvdi/database", () => ({
  db: {
    visitorVisit: {
      findFirst: (...args: unknown[]) => findFirst(...args),
      findMany: (...args: unknown[]) => findMany(...args),
      create: (...args: unknown[]) => create(...args),
    },
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

const { checkAndRecordUserVisit } = await import("./visitor-actions");

beforeEach(() => {
  findFirst.mockReset();
  findMany.mockReset();
  create.mockReset();
});

describe("checkAndRecordUserVisit", () => {
  it("allows and records a first read of the day without touching the limit", async () => {
    findFirst.mockResolvedValue(null);
    findMany.mockResolvedValue([]); // no prior reads today
    create.mockResolvedValue({});

    const result = await checkAndRecordUserVisit("user-1", "article-1");

    expect(result).toEqual({ allowed: true, remaining: 4 });
    expect(create).toHaveBeenCalledWith({
      data: {
        fingerprint: "user:user-1",
        articleId: "article-1",
        userId: "user-1",
      },
    });
  });

  it("does not consume a slot when re-reading an article already visited today", async () => {
    findFirst.mockResolvedValue({ id: "existing-visit" });

    const result = await checkAndRecordUserVisit("user-1", "article-1");

    expect(result).toEqual({ allowed: true, remaining: 5 });
    expect(create).not.toHaveBeenCalled();
  });

  it("allows the 5th distinct article of the day and reports 0 remaining", async () => {
    findFirst.mockResolvedValue(null);
    findMany.mockResolvedValue([
      { articleId: "a1" },
      { articleId: "a2" },
      { articleId: "a3" },
      { articleId: "a4" },
    ]);
    create.mockResolvedValue({});

    const result = await checkAndRecordUserVisit("user-1", "article-5");

    expect(result).toEqual({ allowed: true, remaining: 0 });
    expect(create).toHaveBeenCalledTimes(1);
  });

  it("blocks the 6th distinct article of the day without recording a visit", async () => {
    findFirst.mockResolvedValue(null);
    findMany.mockResolvedValue([
      { articleId: "a1" },
      { articleId: "a2" },
      { articleId: "a3" },
      { articleId: "a4" },
      { articleId: "a5" },
    ]);

    const result = await checkAndRecordUserVisit("user-1", "article-6");

    expect(result).toEqual({ allowed: false, remaining: 0 });
    expect(create).not.toHaveBeenCalled();
  });

  it("counts distinct articles, not total rows, toward the limit", async () => {
    findFirst.mockResolvedValue(null);
    findMany.mockResolvedValue([
      { articleId: "a1" },
      { articleId: "a1" },
      { articleId: "a1" },
    ]);
    create.mockResolvedValue({});

    const result = await checkAndRecordUserVisit("user-1", "article-2");

    expect(result).toEqual({ allowed: true, remaining: 3 });
  });
});
