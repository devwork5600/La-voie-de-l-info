import { Prisma } from "@lvdi/database";
import Link from "next/link";
import React from "react";

import { ArticleCarouselCard } from "@/components/carousel/ArticleCarouselCard";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    media: true;
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

interface ArticlesGridProps {
  articles: ArticleWithRelations[];
  title?: string;
  href?: string;
}

const ArticlesGrid = ({ articles, title, href }: ArticlesGridProps) => {
  return (
    <div className="w-full">
      {title && (
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-playfair text-2xl font-bold">{title}</h2>
          {href && (
            <Link
              href={href}
              className="text-primary text-sm font-semibold tracking-wide uppercase transition hover:underline"
            >
              Voir tout →
            </Link>
          )}
        </div>
      )}

      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCarouselCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesGrid;
