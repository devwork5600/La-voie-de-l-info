'use server';

import { db } from "@lvdi/database";

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
        name: 'asc',
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
    const categories = await db.category.findMany({
      where: {
        parentId: null, // Only get top-level categories
      },
      take: limit,
      orderBy: {
        articles: {
          _count: 'desc',
        },
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
        children: includeChildren ? {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        } : false,
      },
    });

    return categories as unknown as CategoryWithChildren[];
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
        { category: { parent: { slug: categorySlug } } }
      ]
    };
  } else if (categoryId) {
    categoryCondition = { categoryId };
  }

  // Build the author filter
  let authorCondition: any = {};
  if (authorId) {
    authorCondition = { authorId };
  }

  const where: any = {
    AND: [
      categoryCondition,
      authorCondition,
      search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          {
            parts: {
              some: {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } },
                ],
              },
            },
          },
        ],
      } : {},
    ],
  };

  try {
    const [articles, totalCount] = await Promise.all([
      db.article.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
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
              order: 'asc',
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