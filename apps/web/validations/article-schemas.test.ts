import { describe, expect, it } from "vitest";

import { CreateArticleSchema } from "./article-schemas";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

const validArticle = {
  title: "Un titre suffisamment long",
  categoryId: VALID_UUID,
  subCategoryId: "",
  media: {
    type: "IMAGE" as const,
    url: "https://example.com/image.jpg",
    thumbnailUrl: "https://example.com/thumb.jpg",
    alt: "Texte alternatif",
    legend: "Une légende",
  },
  parts: [{ title: "Sous-titre", content: "Un contenu valide." }],
};

describe("CreateArticleSchema", () => {
  it("accepts a fully valid article", () => {
    expect(CreateArticleSchema.safeParse(validArticle).success).toBe(true);
  });

  it("accepts an empty subCategoryId as 'no subcategory'", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      subCategoryId: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid subCategoryId uuid", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      subCategoryId: VALID_UUID,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 5 characters", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      title: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-uuid categoryId", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      categoryId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-uuid subCategoryId that isn't an empty string", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      subCategoryId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid media url", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      media: { ...validArticle.media, url: "not-a-url" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid media type", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      media: { ...validArticle.media, type: "AUDIO" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty parts array", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      parts: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a part with empty content", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      parts: [{ title: "x", content: "" }],
    });
    expect(result.success).toBe(false);
  });

  it("allows a part with no subtitle", () => {
    const result = CreateArticleSchema.safeParse({
      ...validArticle,
      parts: [{ content: "Contenu sans sous-titre." }],
    });
    expect(result.success).toBe(true);
  });
});
