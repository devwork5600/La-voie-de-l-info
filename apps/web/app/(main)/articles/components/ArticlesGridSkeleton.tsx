import { Skeleton } from "@/components/ui/skeleton";

// Mirrors ArticleCarouselCard's exact structure (same "mt-3 ... gap-1"
// wrapper, same line counts for title/excerpt) so the skeleton is the same
// height as the real card — otherwise content below the grid jumps when
// skeletons swap in for real cards.
export function ArticlesGridSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-[18px] w-full" />
        <Skeleton className="h-[18px] w-2/3" />
      </div>
    </div>
  );
}
