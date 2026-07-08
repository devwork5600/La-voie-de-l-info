"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import { getArticles } from "@/actions/categories-actions";
import { ArticleCardSkeleton } from "@/app/author/articles/components/ArticleCardSkeleton";
import AuthorArticleCard from "@/app/author/articles/components/AuthorArticleCard";

interface AuthorArticlesInfiniteProps {
  authorId: string;
  limit?: number;
}

const AuthorArticlesInfinite: React.FC<AuthorArticlesInfiniteProps> = ({
  authorId,
  limit = 12,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["author-articles", authorId, limit],
    queryFn: ({ pageParam = 1 }) =>
      getArticles({ page: pageParam, limit, authorId }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "error") {
    return (
      <p className="text-destructive py-8 text-center text-sm">
        Erreur : {(error as Error).message}
      </p>
    );
  }

  const articles = data?.pages.flatMap((p) => p.articles) ?? [];

  if (status === "success" && articles.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Vous n&rsquo;avez encore publié aucun article.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {status === "pending"
          ? Array.from({ length: limit }).map((_, i) => (
              <ArticleCardSkeleton key={`s-${i}`} />
            ))
          : articles.map((article) => (
              <AuthorArticleCard key={article.id} article={article} />
            ))}

        {isFetchingNextPage &&
          Array.from({ length: 3 }).map((_, i) => (
            <ArticleCardSkeleton key={`l-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} className="h-px w-full" />
    </div>
  );
};

export default AuthorArticlesInfinite;
