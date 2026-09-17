import { getTranslations } from "next-intl/server";

import { CategoryCard } from "@/features/products/components/categories/category-card";
import type { CategoryPreview } from "@/features/products/types/category-preview";
import { resolveCategoryLabel } from "@/features/products/utils/resolve-category-label";
import { cn } from "@/lib/utils";

type CategoryGridProps = {
  categories: CategoryPreview[];
  className?: string;
};

export async function CategoryGrid({ categories, className }: CategoryGridProps) {
  const tCategories = await getTranslations("categories");
  const tCatalogue = await getTranslations("catalogue");

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {categories.map((category) => {
        const name = resolveCategoryLabel(tCategories, category);
        const countLabel = tCatalogue("categoriesPage.productCount", {
          count: category.productCount,
        });

        return (
          <li key={category.apiValue} className="min-w-0">
            <CategoryCard category={category} name={name} countLabel={countLabel} />
          </li>
        );
      })}
    </ul>
  );
}
