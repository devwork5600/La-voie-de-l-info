import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const create = vi.fn();
const deleteArticleMock = vi.fn();
const txArticleUpdate = vi.fn();
const txPartDeleteMany = vi.fn();
const txPartCreateMany = vi.fn();
const transaction = vi.fn();
const revalidatePath = vi.fn();

vi.mock("@lvdi/database", () => ({
  db: {
    article: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      create: (...args: unknown[]) => create(...args),
      delete: (...args: unknown[]) => deleteArticleMock(...args),
    },
    $transaction: (...args: unknown[]) => transaction(...args),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const getUser = vi.fn();
vi.mock("@/lib/auth/auth-session", () => ({
  getUser: (...args: unknown[]) => getUser(...args),
}));

const { createArticle, updateArticle, deleteArticle } =
  await import("./author-actions");

const CATEGORY_ID = "11111111-1111-4111-8111-111111111111";
const SUBCATEGORY_ID = "22222222-2222-4222-8222-222222222222";

const baseArticleInput = {
  title: "Réforme du baccalauréat : les enseignants dénoncent",
  categoryId: CATEGORY_ID,
  subCategoryId: "",
  media: {
    type: "IMAGE" as const,
    url: "https://res.cloudinary.com/demo/image/upload/v1/photo.jpg",
    thumbnailUrl:
      "https://res.cloudinary.com/demo/image/upload/v1/photo_thumb.jpg",
    alt: "Illustration",
    legend: "Une légende",
  },
  parts: [{ title: "Intro", content: "Contenu de la partie." }],
};

beforeEach(() => {
  findUnique.mockReset();
  create.mockReset();
  deleteArticleMock.mockReset();
  txArticleUpdate.mockReset();
  txPartDeleteMany.mockReset();
  txPartCreateMany.mockReset();
  transaction.mockReset();
  revalidatePath.mockReset();
  getUser.mockReset();
});

describe("createArticle", () => {
  it("rejects when there is no authenticated user", async () => {
    getUser.mockResolvedValue(null);

    await expect(createArticle(baseArticleInput)).rejects.toThrow(
      "Seuls les auteurs et administrateurs peuvent créer des articles."
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects a user whose role is neither AUTHOR nor ADMIN", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "READER" });

    await expect(createArticle(baseArticleInput)).rejects.toThrow(
      "Seuls les auteurs et administrateurs peuvent créer des articles."
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("slugifies the title, stripping accents and punctuation", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ id: "article-1" });

    await createArticle(baseArticleInput);

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: "reforme-du-baccalaureat-les-enseignants-denoncent" },
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "reforme-du-baccalaureat-les-enseignants-denoncent",
        }),
      })
    );
  });

  it("appends a timestamp suffix when the slug already exists", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    findUnique.mockResolvedValue({ id: "existing-article" });
    create.mockResolvedValue({ id: "article-2" });
    vi.spyOn(Date, "now").mockReturnValue(1234567890);

    await createArticle(baseArticleInput);

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "reforme-du-baccalaureat-les-enseignants-denoncent-1234567890",
        }),
      })
    );

    vi.restoreAllMocks();
  });

  it("prefers subCategoryId over categoryId when both are set", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ id: "article-1" });

    await createArticle({ ...baseArticleInput, subCategoryId: SUBCATEGORY_ID });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ categoryId: SUBCATEGORY_ID }),
      })
    );
  });

  it("falls back to categoryId when subCategoryId is an empty string", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ id: "article-1" });

    await createArticle({ ...baseArticleInput, subCategoryId: "" });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ categoryId: CATEGORY_ID }),
      })
    );
  });

  it("returns success with the new article id", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "ADMIN" });
    findUnique.mockResolvedValue(null);
    create.mockResolvedValue({ id: "article-42" });

    const result = await createArticle(baseArticleInput);

    expect(result).toEqual({ success: true, articleId: "article-42" });
    expect(revalidatePath).toHaveBeenCalledWith("/author/articles");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("returns a failure result instead of throwing when the database write fails", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    findUnique.mockResolvedValue(null);
    create.mockRejectedValue(new Error("db down"));

    const result = await createArticle(baseArticleInput);

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de la création de l'article.",
    });
  });
});

describe("updateArticle", () => {
  const runTransaction = () => {
    transaction.mockImplementation(async (cb: (tx: unknown) => unknown) =>
      cb({
        article: { update: txArticleUpdate },
        articlePart: {
          deleteMany: txPartDeleteMany,
          createMany: txPartCreateMany,
        },
      })
    );
  };

  it("rejects when the user is not an author or admin", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "READER" });

    await expect(updateArticle("article-1", baseArticleInput)).rejects.toThrow(
      "Seuls les auteurs et administrateurs peuvent modifier des articles."
    );
    expect(transaction).not.toHaveBeenCalled();
  });

  it("scopes the update to the author's own article when the user is not an admin", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    runTransaction();
    txArticleUpdate.mockResolvedValue({ id: "article-1" });
    txPartDeleteMany.mockResolvedValue({});
    txPartCreateMany.mockResolvedValue({});

    await updateArticle("article-1", baseArticleInput);

    expect(txArticleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "article-1", authorId: "user-1" },
      })
    );
  });

  it("lets an admin update any article without an authorId filter", async () => {
    getUser.mockResolvedValue({ id: "admin-1", role: "ADMIN" });
    runTransaction();
    txArticleUpdate.mockResolvedValue({ id: "article-1" });
    txPartDeleteMany.mockResolvedValue({});
    txPartCreateMany.mockResolvedValue({});

    await updateArticle("article-1", baseArticleInput);

    expect(txArticleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "article-1" } })
    );
  });

  it("replaces existing parts by deleting then recreating them", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    runTransaction();
    txArticleUpdate.mockResolvedValue({ id: "article-1" });
    txPartDeleteMany.mockResolvedValue({});
    txPartCreateMany.mockResolvedValue({});

    await updateArticle("article-1", baseArticleInput);

    expect(txPartDeleteMany).toHaveBeenCalledWith({
      where: { articleId: "article-1" },
    });
    expect(txPartCreateMany).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          content: "Contenu de la partie.",
          order: 0,
          articleId: "article-1",
        }),
      ],
    });
  });

  it("returns a failure result instead of throwing when the transaction fails", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    transaction.mockRejectedValue(new Error("db down"));

    const result = await updateArticle("article-1", baseArticleInput);

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de l'article.",
    });
  });
});

describe("deleteArticle", () => {
  it("rejects when the user is not an author or admin", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "READER" });

    await expect(deleteArticle("article-1")).rejects.toThrow(
      "Seuls les auteurs et administrateurs peuvent supprimer des articles."
    );
    expect(deleteArticleMock).not.toHaveBeenCalled();
  });

  it("scopes deletion to the author's own article when the user is not an admin", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    deleteArticleMock.mockResolvedValue({});

    await deleteArticle("article-1");

    expect(deleteArticleMock).toHaveBeenCalledWith({
      where: { id: "article-1", authorId: "user-1" },
    });
  });

  it("lets an admin delete any article without an authorId filter", async () => {
    getUser.mockResolvedValue({ id: "admin-1", role: "ADMIN" });
    deleteArticleMock.mockResolvedValue({});

    await deleteArticle("article-1");

    expect(deleteArticleMock).toHaveBeenCalledWith({
      where: { id: "article-1" },
    });
  });

  it("returns a failure result instead of throwing when the database delete fails", async () => {
    getUser.mockResolvedValue({ id: "user-1", role: "AUTHOR" });
    deleteArticleMock.mockRejectedValue(new Error("db down"));

    const result = await deleteArticle("article-1");

    expect(result).toEqual({
      success: false,
      error: "Une erreur est survenue lors de la suppression de l'article.",
    });
  });
});
