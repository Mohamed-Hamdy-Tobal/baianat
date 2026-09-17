import { MainContainer } from "@/components/layout/main-container";
import { CategoryGridSkeleton } from "@/features/products/components/categories/category-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-8 py-2" aria-hidden>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <CategoryGridSkeleton count={8} />
        </div>
      </MainContainer>
    </div>
  );
}
