'use client';

import { Prisma } from "@lvdi/database";
import Link from "next/link";
import { useTimeAgo } from "next-timeago";
import React from "react";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

interface TrendingArticlesProps {
  articles: ArticleWithRelations[];
  title?: string;
}

const TrendingArticles: React.FC<TrendingArticlesProps> = ({ articles, title = "Dépêches" }) => {
  const { TimeAgo } = useTimeAgo();

  return (
    <div className="w-full">
      <div className="border-t-2 border-foreground pt-3 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest">{title}</h2>
      </div>

      <ul className="mt-6 divide-y divide-border">
        {articles.map((article) => {
          const excerpt = article.parts[0]?.content;

          return (
            <li key={article.id} className="py-4 first:pt-0">
              <Link href={`/articles/${article.slug}`} className="group">
                <p className="text-xs font-semibold uppercase text-primary">
                  {article.category.name} · <TimeAgo date={article.createdAt} locale="fr" />
                </p>
                <h3 className="mt-1 font-semibold leading-snug transition group-hover:text-primary">
                  {article.title}
                </h3>
                {excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrendingArticles;
