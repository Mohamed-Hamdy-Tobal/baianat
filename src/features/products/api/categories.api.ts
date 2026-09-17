import "server-only";

import { CATALOGUE_FETCH_OPTIONS, request } from "@/lib/api/http";

import { toCategoryFromDto } from "../mappers/category.mapper";
import { toCategoryPreview } from "../mappers/category-preview.mapper";
import {
  categoryListSchema,
  categoryPreviewPageSchema,
} from "../schemas/category.schema";
import type { Category } from "../types/category";
import type { CategoryPreview } from "../types/category-preview";
import { buildCategoryPreviewPath } from "../utils/build-category-preview-path";

export async function getCategories(): Promise<Category[]> {
  const values = await request("/products/categories", {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: categoryListSchema,
  });

  return values.map(toCategoryFromDto);
}

/**
 * Dynamic category list + lightweight per-category preview (image + total).
 * One failed preview does not fail the whole page.
 */
export async function getCategoryPreviews(): Promise<CategoryPreview[]> {
  const categories = await getCategories();

  const settled = await Promise.allSettled(
    categories.map(async (category) => {
      const page = await request(buildCategoryPreviewPath(category.apiValue), {
        ...CATALOGUE_FETCH_OPTIONS,
        schema: categoryPreviewPageSchema,
      });
      return toCategoryPreview(category, page);
    }),
  );

  return categories.map((category, index) => {
    const result = settled[index];
    if (result?.status === "fulfilled") {
      return result.value;
    }
    return toCategoryPreview(category, null);
  });
}
