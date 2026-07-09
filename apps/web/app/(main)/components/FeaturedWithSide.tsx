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
  sideArticles: ArticleWithRelations[];
  special?: "subscribe" | "newsletter";
  priority?: boolean;
}

const FeaturedWithSide = ({
  articles,
  sideArticles,
  special = "subscribe",
  priority = false,
}: FeaturedWithSideProps) => {
  return (
    <div className="mx-auto flex max-w-[1440px] justify-center gap-6 px-4 py-8">
      <main className="flex w-full max-w-4xl flex-col gap-16">
        {articles.map((article, index) => (
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
            priority={priority && index === 0}
          />
        ))}
      </main>

      <aside className="hidden lg:block">
        <div className="sticky top-24 w-[260px] shrink-0">
          <TrendingArticles articles={sideArticles} special={special} />
        </div>
      </aside>
    </div>
  );
};

export default FeaturedWithSide;
