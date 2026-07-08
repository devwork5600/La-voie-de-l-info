"use server";

import { db } from "@lvdi/database";

import { getUser } from "@/lib/auth/auth-session";

/**
 * Returns real-time statistics for the currently logged-in author.
 */
export async function getAuthorStats() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const articles = await db.article.findMany({
    where: { authorId: user.id },
    select: { id: true },
  });

  const articleIds = articles.map((a) => a.id);

  const [totalViews, totalLikes] = await Promise.all([
    db.visitorVisit.count({ where: { articleId: { in: articleIds } } }),
    db.like.count({ where: { articleId: { in: articleIds } } }),
  ]);

  return { articleCount: articles.length, totalViews, totalLikes };
}
