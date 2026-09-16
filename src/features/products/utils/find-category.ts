import type { Category } from "../types/category";

export function findCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

/** Message key within the `categories` namespace for a Category.labelKey. */
export function categoryMessageKey(labelKey: string): string {
  return labelKey.replace(/^categories\./, "");
}
