import { categoryMessageKey } from "@/features/products/utils/find-category";
import { formatCategoryDisplayName } from "@/features/products/utils/format-category-display-name";

type CategoryLabelSource = {
  slug: string;
  labelKey: string;
};

type CategoryTranslator = {
  has: (key: string) => boolean;
  (key: string): string;
};

/**
 * Resolve a category label from i18n when available; otherwise humanize the slug.
 * Works for known and future DummyJSON categories without hardcoding the list.
 */
export function resolveCategoryLabel(t: CategoryTranslator, category: CategoryLabelSource): string {
  const key = categoryMessageKey(category.labelKey);
  if (t.has(key)) {
    return t(key);
  }
  return formatCategoryDisplayName(category.slug);
}
