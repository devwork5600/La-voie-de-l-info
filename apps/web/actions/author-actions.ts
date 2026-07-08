"use server";

import { db } from "@lvdi/database";
import { revalidatePath } from "next/cache";

import { getUser } from "@/lib/auth/auth-session";
import {
  CreateArticleSchema,
  CreateArticleSchemaType,
} from "@/validations/article-schemas";

/**
 * Creates a new article in the database.
 */
export async function createArticle(data: CreateArticleSchemaType) {
  const user = await getUser();

  if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
    throw new Error(
      "Seuls les auteurs et administrateurs peuvent créer des articles."
    );
  }

  const validatedData = CreateArticleSchema.parse(data);

  const slug = validatedData.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const existingArticle = await db.article.findUnique({
    where: { slug },
  });

  const finalSlug = existingArticle ? `${slug}-${Date.now()}` : slug;

  try {
    const finalCategoryId =
      validatedData.subCategoryId && validatedData.subCategoryId !== ""
        ? validatedData.subCategoryId
        : validatedData.categoryId;

    const article = await db.article.create({
      data: {
        title: validatedData.title,
        slug: finalSlug,
        authorId: user.id,
        categoryId: finalCategoryId,
        media: {
          create: {
            type: validatedData.media.type,
            url: validatedData.media.url,
            thumbnailUrl: validatedData.media.thumbnailUrl,
            alt: validatedData.media.alt,
            legend: validatedData.media.legend,
          },
        },
        parts: {
          create: validatedData.parts.map((part, index) => ({
            title: part.title || null,
            content: part.content,
            order: index,
          })),
        },
      },
    });

    revalidatePath("/author/articles");
    revalidatePath("/");

    return { success: true, articleId: article.id };
  } catch (error) {
    console.error("Failed to create article:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'article.",
    };
  }
}

/**
 * Updates an existing article.
 */
export async function updateArticle(id: string, data: CreateArticleSchemaType) {
  const user = await getUser();

  if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
    throw new Error(
      "Seuls les auteurs et administrateurs peuvent modifier des articles."
    );
  }

  const isAdmin = user.role === "ADMIN";
  const validatedData = CreateArticleSchema.parse(data);

  try {
    const finalCategoryId =
      validatedData.subCategoryId && validatedData.subCategoryId !== ""
        ? validatedData.subCategoryId
        : validatedData.categoryId;

    // Use a transaction to update article, image and parts
    const article = await db.$transaction(async (tx) => {
      // 1. Update main article info
      const updatedArticle = await tx.article.update({
        where: isAdmin ? { id } : { id, authorId: user.id }, // Security: ensure author owns the article, unless admin
        data: {
          title: validatedData.title,
          categoryId: finalCategoryId,
          media: {
            update: {
              url: validatedData.media.url,
              alt: validatedData.media.alt,
              legend: validatedData.media.legend,
            },
          },
        },
      });

      // 2. Handle parts: easiest way is to delete and recreate since it's a small number of parts
      await tx.articlePart.deleteMany({
        where: { articleId: id },
      });

      await tx.articlePart.createMany({
        data: validatedData.parts.map((part, index) => ({
          title: part.title || null,
          content: part.content,
          order: index,
          articleId: id,
        })),
      });

      return updatedArticle;
    });

    revalidatePath(`/author/articles/${id}/edit`);
    revalidatePath("/author/articles");
    revalidatePath("/");

    return { success: true, articleId: article.id };
  } catch (error) {
    console.error("Failed to update article:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la mise à jour de l'article.",
    };
  }
}

/**
 * Deletes an article. Authors may only delete their own articles; admins may delete any.
 */
export async function deleteArticle(id: string) {
  const user = await getUser();

  if (!user || (user.role !== "AUTHOR" && user.role !== "ADMIN")) {
    throw new Error(
      "Seuls les auteurs et administrateurs peuvent supprimer des articles."
    );
  }

  const isAdmin = user.role === "ADMIN";

  try {
    await db.article.delete({
      where: isAdmin ? { id } : { id, authorId: user.id },
    });

    revalidatePath("/author/articles");
    revalidatePath("/author");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete article:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression de l'article.",
    };
  }
}
