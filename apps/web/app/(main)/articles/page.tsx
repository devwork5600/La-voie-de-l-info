import { Suspense } from "react";

import { ArticlesGridSkeleton } from "./components/ArticlesGridSkeleton";
import { ArticlesInfiniteScroll } from "./components/ArticlesInfiniteScroll";

import { getRootCategoriesWithChildren } from "@/actions/categories-actions";

async function ArticlesData() {
  const categories = await getRootCategoriesWithChildren();
  return <ArticlesInfiniteScroll initialCategories={categories} />;
}

export default function ArticlesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-8">
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
