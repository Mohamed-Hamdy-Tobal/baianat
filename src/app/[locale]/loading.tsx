import { MainContainer } from "@/components/layout/main-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocaleLoading() {
  return (
    <MainContainer>
      <div className="flex flex-col gap-8 py-2" aria-hidden>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full max-w-xl" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-border bg-surface">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainContainer>
  );
}
