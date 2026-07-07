import { Prisma } from "@lvdi/database";
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
}

const ArticlesGrid = ({ articles }: ArticlesGridProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {articles.map((article) => (
        <ArticleCarouselCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticlesGrid;
