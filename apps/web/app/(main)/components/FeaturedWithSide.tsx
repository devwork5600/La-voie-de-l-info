import { Prisma } from "@lvdi/database";
import React from "react";

import FeaturedArticleCard from "./FeaturedArticleCard";
import TrendingArticles from "./TrendingArticles";

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    media: true;
    category: { select: { name: true } };
    author: { select: { name: true } };
    parts: { select: { content: true; order: true } };
  };
}>;

interface FeaturedWithSideProps {
  articles: ArticleWithRelations[];
  sideChunks: ArticleWithRelations[][];
}

const FeaturedWithSide = ({ articles, sideChunks }: FeaturedWithSideProps) => {
  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-8">
      {articles.map((article, index) => (
        <div key={article.id} className="flex justify-center gap-6">
          <main className="w-full max-w-4xl">
            <FeaturedArticleCard
              slug={article.slug}
              tag={article.category.name}
              title={article.title}
              excerpt={article.parts[0]?.content ?? ""}
              body={
                article.parts[1]?.content ?? article.parts[0]?.content ?? ""
              }
              imageUrl={article.media?.url}
              imageAlt={article.media?.alt ?? undefined}
              author={article.author.name ?? "Rédaction"}
              publishedAt={article.createdAt}
            />
          </main>

          <aside className="hidden md:block">
            <div className="w-[260px] shrink-0">
              <TrendingArticles
                articles={sideChunks[index] ?? []}
                special={index % 2 === 0 ? "subscribe" : "newsletter"}
              />
            </div>
          </aside>
        </div>
      ))}
    </div>
  );
};

export default FeaturedWithSide;
