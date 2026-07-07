"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { ArticlesGridSkeleton } from "./ArticlesGridSkeleton";

import { getArticles } from "@/actions/categories-actions";
import { ArticleCarouselCard } from "@/components/carousel/ArticleCarouselCard";
import { Input } from "@/components/ui/input";
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
  children: CategoryChild[];
}

interface ArticlesInfiniteScrollProps {
  initialCategories: CategoryWithChildren[];
}

export function ArticlesInfiniteScroll({
  initialCategories,
}: ArticlesInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialSubCategory = searchParams.get("subcategory") || "all";

  const [searchValue, setSearchValue] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(searchValue, 300);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState(initialSubCategory);

  // Find current category to show children (subcategories)
  const currentCategoryData = initialCategories.find(
    (c) => c.slug === selectedCategory
  );

  // Sync with URL if it changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlCategory = searchParams.get("category") || "all";
    const urlSubCategory = searchParams.get("subcategory") || "all";

    // Deferred so setState isn't called synchronously within the effect body.
    queueMicrotask(() => {
      if (urlSearch !== searchValue) setSearchValue(urlSearch);
      if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
      if (urlSubCategory !== selectedSubCategory)
        setSelectedSubCategory(urlSubCategory);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when filters change
  const updateUrl = (
    params: { search?: string; category?: string; subcategory?: string },
    replace = false
  ) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
    }

    if (params.category !== undefined) {
      if (params.category && params.category !== "all")
        newParams.set("category", params.category);
      else newParams.delete("category");
      // Reset subcategory when category changes
      newParams.delete("subcategory");
    }

    if (params.subcategory !== undefined) {
      if (params.subcategory && params.subcategory !== "all")
        newParams.set("subcategory", params.subcategory);
      else newParams.delete("subcategory");
    }

    const query = newParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (replace) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url, { scroll: false });
    }
  };

  // Debounced URL update for search
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (debouncedSearch !== urlSearch) {
      updateUrl({ search: debouncedSearch }, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [
        "all-articles",
        debouncedSearch,
        selectedCategory,
        selectedSubCategory,
      ],
      queryFn: ({ pageParam = 1 }) =>
        getArticles({
          page: pageParam,
          limit: 12,
          search: debouncedSearch,
          categorySlug:
            selectedCategory === "all" ? undefined : selectedCategory,
          subCategorySlug:
            selectedSubCategory === "all" ? undefined : selectedSubCategory,
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

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-8">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div className="space-y-2 text-center xl:text-left">
          <h1 className="font-playfair text-4xl font-bold">
            Tous les articles
          </h1>
          <p className="text-muted-foreground">
            Découvrez toute l&rsquo;actualité et nos dossiers exclusifs.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 xl:w-auto xl:flex-row">
          <div className="relative w-full xl:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Rechercher..."
              className="h-10 pr-10 pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <button
                onClick={() => {
                  setSearchValue("");
                  updateUrl({ search: "" });
                }}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex w-full gap-2 xl:w-auto">
            <div className="flex-1 xl:w-44">
              <Select
                value={selectedCategory}
                onValueChange={(val) => updateUrl({ category: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {initialCategories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 xl:w-44">
              <Select
                value={selectedSubCategory}
                onValueChange={(val) => updateUrl({ subcategory: val })}
                disabled={
                  selectedCategory === "all" ||
                  !currentCategoryData?.children?.length
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Toutes les sous-catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Toutes les sous-catégories
                  </SelectItem>
                  {currentCategoryData?.children?.map((sub) => (
                    <SelectItem key={sub.id} value={sub.slug}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {status === "success" && articles.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-xl">
            Aucun article ne correspond à votre recherche.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {status === "pending"
          ? Array.from({ length: 12 }).map((_, i) => (
              <ArticlesGridSkeleton key={`skeleton-${i}`} />
            ))
          : articles.map((article) => (
              <ArticleCarouselCard key={article.id} article={article} />
            ))}

        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <ArticlesGridSkeleton key={`loading-skeleton-${i}`} />
          ))}
      </div>

      {status === "error" && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive border p-8 text-center">
          Une erreur est survenue lors du chargement des articles.
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      <div ref={sentinelRef} className="flex justify-center py-12">
        {!hasNextPage && articles.length > 0 && (
          <p className="text-muted-foreground italic">
            Vous avez atteint la fin de la liste.
          </p>
        )}
      </div>
    </div>
  );
}
