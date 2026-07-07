import { Prisma } from "@lvdi/database";
import React from "react";

import FeaturedArticleCard from "./FeaturedArticleCard";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    media: true;
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

interface FeaturedThreeUpProps {
  articles: ArticleWithRelations[];
}

const FeaturedThreeUp = ({ articles }: FeaturedThreeUpProps) => {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
      {articles.map((article) => (
        <FeaturedArticleCard
          key={article.id}
          slug={article.slug}
          tag={article.category.name}
          title={article.title}
          excerpt={article.parts[0]?.content ?? ""}
          body={article.parts[1]?.content ?? article.parts[0]?.content ?? ""}
          imageUrl={article.media?.url}
          imageAlt={article.media?.alt ?? undefined}
          author={article.author.name ?? "Rédaction"}
          publishedAt={article.createdAt}
        />
      ))}
    </div>
  );
};

export default FeaturedThreeUp;
