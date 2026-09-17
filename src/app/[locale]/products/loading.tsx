import { MainContainer } from "@/components/layout/main-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-8 py-2" aria-hidden>
          <Skeleton className="h-4 w-48" />
          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72 max-w-full" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <Skeleton className="hidden h-80 rounded-lg lg:block" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="aspect-3/4 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}
