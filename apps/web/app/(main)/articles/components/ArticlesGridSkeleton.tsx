import { Skeleton } from "@/components/ui/skeleton";

export function ArticlesGridSkeleton() {
  return (
    <div className="flex w-full flex-col">
      <Skeleton className="aspect-4/3 w-full" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
