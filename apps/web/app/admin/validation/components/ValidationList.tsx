"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import ValidationArticleCard from "./ValidationArticleCard";

import { getUnpublishedArticles } from "@/actions/admin-actions";
import { ArticleCardSkeleton } from "@/app/author/articles/components/ArticleCardSkeleton";

const ValidationList: React.FC = () => {
  const { data: articles, status } = useQuery({
    queryKey: ["unpublished-articles"],
    queryFn: () => getUnpublishedArticles(),
  });

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Aucun article en attente de validation.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ValidationArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ValidationList;
