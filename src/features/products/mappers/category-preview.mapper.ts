import type { CategoryPreviewPageDto } from "../schemas/category.schema";
import type { Category } from "../types/category";
import type { CategoryPreview } from "../types/category-preview";

export function toCategoryPreview(
  category: Category,
  page: CategoryPreviewPageDto | null,
): CategoryPreview {
  const thumbnail = page?.products[0]?.thumbnail?.trim();

  return {
    slug: category.slug,
    apiValue: category.apiValue,
    labelKey: category.labelKey,
    productCount: page?.total ?? 0,
    image: thumbnail && thumbnail.length > 0 ? thumbnail : null,
  };
}
