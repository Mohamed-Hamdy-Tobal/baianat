import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSlugLoading() {
  return (
    <div className="flex flex-col gap-8 py-2" aria-hidden>
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="mt-4 h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
