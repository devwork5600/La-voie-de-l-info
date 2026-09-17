import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const findMany = vi.fn();
const count = vi.fn();
const findUniqueLike = vi.fn();

vi.mock("@lvdi/database", () => ({
  db: {
    article: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      findMany: (...args: unknown[]) => findMany(...args),
      count: (...args: unknown[]) => count(...args),
    },
    like: {
      findUnique: (...args: unknown[]) => findUniqueLike(...args),
    },
  },
  Prisma: {},
}));

const getUser = vi.fn();
vi.mock("@/lib/auth/auth-session", () => ({
  getUser: (...args: unknown[]) => getUser(...args),
}));

const { getArticleBySlug, getArticles } = await import("./categories-actions");

beforeEach(() => {
  findUnique.mockReset();
  findMany.mockReset();
  count.mockReset();
  findUniqueLike.mockReset();
  getUser.mockReset();
  getUser.mockResolvedValue(null);
  count.mockResolvedValue(0);
  findMany.mockResolvedValue([]);
});

describe("getArticleBySlug", () => {
  it("only queries published articles, so an unpublished draft is never returned by slug", async () => {
    findUnique.mockResolvedValue(null);

    await getArticleBySlug("un-article-en-attente-de-relecture");

    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          slug: "un-article-en-attente-de-relecture",
          published: true,
        }),
      })
    );
  });
});

describe("getArticles", () => {
  it("excludes unpublished articles by default", async () => {
    await getArticles({});

    const where = findMany.mock.calls[0][0].where;
    expect(where.AND).toEqual(expect.arrayContaining([{ published: true }]));
  });

  it("includes unpublished articles only when includeUnpublished is explicitly set (author/admin views)", async () => {
    await getArticles({ includeUnpublished: true });

    const where = findMany.mock.calls[0][0].where;
    expect(where.AND).not.toEqual(
      expect.arrayContaining([{ published: true }])
    );
  });
});
