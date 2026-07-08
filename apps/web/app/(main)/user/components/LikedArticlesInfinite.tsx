"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";

import { getLikedArticles } from "@/actions/categories-actions";
import { ArticlesGridSkeleton } from "@/app/(main)/articles/components/ArticlesGridSkeleton";
import { ArticleCarouselCard } from "@/components/carousel/ArticleCarouselCard";

const LikedArticlesInfinite: React.FC = () => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["liked-articles"],
      queryFn: ({ pageParam = 1 }) =>
        getLikedArticles({ page: pageParam, limit: 12 }),
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

  const articles = data?.pages.flatMap((p) => p.articles) ?? [];

  if (status === "success" && articles.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Vous n&rsquo;avez encore aimé aucun article.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {status === "pending"
          ? Array.from({ length: 8 }).map((_, i) => (
              <ArticlesGridSkeleton key={`s-${i}`} />
            ))
          : articles.map((article) => (
              <ArticleCarouselCard key={article.id} article={article} />
            ))}

        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <ArticlesGridSkeleton key={`l-${i}`} />
          ))}
      </div>

      <div ref={sentinelRef} className="h-px w-full" />
    </div>
  );
};

export default LikedArticlesInfinite;
