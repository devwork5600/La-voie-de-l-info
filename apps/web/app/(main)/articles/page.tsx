import type { Metadata } from "next";
import { Suspense } from "react";

import { ArticlesGridSkeleton } from "./components/ArticlesGridSkeleton";
import { ArticlesInfiniteScroll } from "./components/ArticlesInfiniteScroll";

import { getRootCategoriesWithChildren } from "@/actions/categories-actions";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Tous les articles",
  description:
    "Parcourez l'ensemble de nos articles : politique, économie, high-tech, écologie, culture et bien plus.",
  alternates: { canonical: "/articles" },
};

async function ArticlesData() {
  const categories = await getRootCategoriesWithChildren();
  return <ArticlesInfiniteScroll initialCategories={categories} />;
}

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[80vh] max-w-[1440px] flex-col gap-10 px-4 py-8">
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
              <Skeleton className="h-10 w-full xl:w-64" />
              <div className="flex w-full gap-2 xl:w-auto">
                <Skeleton className="h-10 flex-1 xl:w-44" />
                <Skeleton className="h-10 flex-1 xl:w-44" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ArticlesGridSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </div>
      }
    >
      <ArticlesData />
    </Suspense>
  );
}
