"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

import AdminArticleCard from "./AdminArticleCard";

import { getArticles } from "@/actions/categories-actions";
import { ArticleCardSkeleton } from "@/app/author/articles/components/ArticleCardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryChild {
  id: string;
  name: string;
  slug: string;
}

interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  children?: CategoryChild[];
}

interface Author {
  id: string;
  name: string | null;
  email: string;
}

interface AdminArticlesInfiniteProps {
  categories: CategoryWithChildren[];
  authors: Author[];
}

const AdminArticlesInfinite: React.FC<AdminArticlesInfiniteProps> = ({
  categories,
  authors,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedAuthor, setSelectedAuthor] = useState("all");

  const currentCategoryData = categories.find(
    (c) => c.slug === selectedCategory
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [
        "admin-articles",
        selectedCategory,
        selectedSubCategory,
        selectedAuthor,
      ],
      queryFn: ({ pageParam = 1 }) =>
        getArticles({
          page: pageParam,
          limit: 12,
          categorySlug:
            selectedCategory === "all" ? undefined : selectedCategory,
          subCategorySlug:
            selectedSubCategory === "all" ? undefined : selectedSubCategory,
          authorId: selectedAuthor === "all" ? undefined : selectedAuthor,
        }),
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            setSelectedSubCategory("all");
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedSubCategory}
          onValueChange={setSelectedSubCategory}
          disabled={
            selectedCategory === "all" || !currentCategoryData?.children?.length
          }
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Toutes les sous-catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sous-catégories</SelectItem>
            {currentCategoryData?.children?.map((sub) => (
              <SelectItem key={sub.id} value={sub.slug}>
                {sub.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Tous les auteurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les auteurs</SelectItem>
            {authors.map((author) => (
              <SelectItem key={author.id} value={author.id}>
                {author.name ?? author.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {status === "success" && articles.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">
          Aucun article ne correspond à ces filtres.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {status === "pending"
          ? Array.from({ length: 12 }).map((_, i) => (
              <ArticleCardSkeleton key={`s-${i}`} />
            ))
          : articles.map((article) => (
              <AdminArticleCard key={article.id} article={article} />
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

export default AdminArticlesInfinite;
