"use server";

import { db, Prisma } from "@lvdi/database";

import { getUser } from "@/lib/auth/auth-session";

// console.log(db, "database")
/**
 * Interface for Category with article count and children
 */
export interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  _count?: {
    articles: number;
  };
  children?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

/**
 * Fetches all root categories with their children for hierarchical selection.
 */
export async function getRootCategoriesWithChildren() {
  try {
    const categories = await db.category.findMany({
      where: {
        parentId: null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch root categories with children:", error);
    throw new Error("Impossible de récupérer la liste des catégories.");
  }
}

export async function getCategoriesByArticleCount(
  limit: number = 10,
  includeChildren: boolean = false
): Promise<CategoryWithChildren[]> {
  try {
    // Direct article count alone under-ranks parents whose content actually
    // lives on their subcategories, so children's counts are fetched here too
    // and folded into the ranking total below (Prisma can't sum a nested
    // relation's count at the query level, hence the JS sort/slice).
    const categories = await db.category.findMany({
      where: {
        parentId: null, // Only get top-level categories
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            articles: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                articles: true,
              },
            },
          },
        },
      },
    });

    const ranked = categories
      .map((category) => ({
        ...category,
        totalArticles:
          category._count.articles +
          category.children.reduce(
            (sum, child) => sum + child._count.articles,
            0
          ),
      }))
      .sort((a, b) => b.totalArticles - a.totalArticles)
      .slice(0, limit);

    return ranked.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      _count: category._count,
      children: includeChildren
        ? category.children.map((child) => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
          }))
        : undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Impossible de récupérer les catégories.");
  }
}

export interface GetArticlesParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  categorySlug?: string;
  subCategorySlug?: string;
  search?: string;
  authorId?: string;
}

/**
 * Fetches a paginated list of articles for TanStack Query.
 */
export async function getArticles({
  page = 1,
  limit = 10,
  categoryId,
  categorySlug,
  subCategorySlug,
  search,
  authorId,
}: GetArticlesParams = {}) {
  const skip = (page - 1) * limit;

  // Build the category filter
  let categoryCondition = {};

  if (subCategorySlug) {
    categoryCondition = { category: { slug: subCategorySlug } };
  } else if (categorySlug) {
    // If we have a category slug, we want articles in this category
    // OR in any of its subcategories
    categoryCondition = {
      OR: [
        { category: { slug: categorySlug } },
        { category: { parent: { slug: categorySlug } } },
      ],
    };
  } else if (categoryId) {
    categoryCondition = { categoryId };
  }

  // Build the author filter
  let authorCondition: Prisma.ArticleWhereInput = {};
  if (authorId) {
    authorCondition = { authorId };
  }

  const where: Prisma.ArticleWhereInput = {
    AND: [
      categoryCondition,
      authorCondition,
      search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              {
                parts: {
                  some: {
                    OR: [
                      { title: { contains: search, mode: "insensitive" } },
                      { content: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              },
            ],
          }
        : {},
    ],
  };

  try {
    const [articles, totalCount] = await Promise.all([
      db.article.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          media: true,
          category: {
            select: {
              name: true,
            },
          },
          author: {
            select: {
              name: true,
            },
          },
          parts: {
            select: {
              content: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      }),
      db.article.count({
        where,
      }),
    ]);

    return {
      articles,
      nextPage: skip + articles.length < totalCount ? page + 1 : undefined,
      totalCount,
    };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    throw new Error("Impossible de récupérer les articles.");
  }
}

/**
 * Fetches a single article by slug with its relations, for the article page.
 */
export async function getArticleBySlug(slug: string) {
  try {
    const article = await db.article.findUnique({
      where: { slug },
      include: {
        media: true,
        author: {
          select: {
            name: true,
          },
        },
        category: {
          include: {
            parent: true,
          },
        },
        parts: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!article) return null;

    const user = await getUser();

    const [isLiked, likesCount] = await Promise.all([
      user
        ? db.like
            .findUnique({
              where: {
                userId_articleId: { userId: user.id, articleId: article.id },
              },
            })
            .then((like) => !!like)
        : Promise.resolve(false),
      db.like.count({ where: { articleId: article.id } }),
    ]);

    return { ...article, isLiked, likesCount };
  } catch (error) {
    console.error("Failed to fetch article:", error);
    throw new Error("Impossible de récupérer l'article.");
  }
}

/**
 * Toggles the current user's like on an article.
 */
export async function toggleLike(articleId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Vous devez être connecté pour aimer un article.");
  }

  const existingLike = await db.like.findUnique({
    where: { userId_articleId: { userId: user.id, articleId } },
  });

  if (existingLike) {
    await db.like.delete({ where: { id: existingLike.id } });
    return { liked: false };
  }

  await db.like.create({ data: { userId: user.id, articleId } });
  return { liked: true };
}
