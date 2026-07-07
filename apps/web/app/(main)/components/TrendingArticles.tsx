"use client";

import { Prisma } from "@lvdi/database";
import Link from "next/link";
import { useTimeAgo } from "next-timeago";
import React from "react";

import { NewsletterSignup } from "@/components/layout/footer/NewsletterSignup";
import { Button } from "@/components/ui/button";

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
  special?: "subscribe" | "newsletter";
}

const TrendingArticles: React.FC<TrendingArticlesProps> = ({
  articles,
  title = "Dépêches",
  special = "subscribe",
}) => {
  const { TimeAgo } = useTimeAgo();

  return (
    <div className="w-full">
      <div className="border-foreground border-t-2 pt-3 text-center">
        <h2 className="text-sm font-semibold tracking-widest uppercase">
          {title}
        </h2>
      </div>

      <ul className="divide-border mt-6 divide-y">
        {articles.slice(0, 4).map((article) => {
          const excerpt = article.parts[0]?.content;

          return (
            <li key={article.id} className="py-4 first:pt-0">
              <Link href={`/articles/${article.slug}`} className="group">
                <p className="text-primary text-xs font-semibold uppercase">
                  {article.category.name} ·{" "}
                  <TimeAgo date={article.createdAt} locale="fr" />
                </p>
                <h3 className="group-hover:text-primary mt-1 leading-snug font-semibold transition">
                  {article.title}
                </h3>
                {excerpt && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {excerpt}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="bg-primary text-primary-foreground mt-8 rounded-md p-6">
        {special === "subscribe" ? (
          <Button
            asChild
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full"
          >
            <Link href="/subscribe">S&rsquo;abonner</Link>
          </Button>
        ) : (
          <NewsletterSignup buttonClassName="bg-primary-foreground text-primary hover:bg-primary-foreground/90" />
        )}
      </div>
    </div>
  );
};

export default TrendingArticles;
