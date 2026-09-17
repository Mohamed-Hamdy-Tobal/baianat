import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CategoryCardSkeletonProps = {
  className?: string;
};

export function CategoryCardSkeleton({ className }: CategoryCardSkeletonProps) {
  return (
    <Skeleton className={cn("aspect-[4/3] w-full rounded-xl", className)} />
  );
}

type CategoryGridSkeletonProps = {
  count?: number;
  className?: string;
};

export function CategoryGridSkeleton({ count = 8, className }: CategoryGridSkeletonProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <CategoryCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
