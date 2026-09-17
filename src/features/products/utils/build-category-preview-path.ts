import { CATEGORY_PREVIEW_SELECT } from "../schemas/category.schema";

/** Builds the lightweight DummyJSON path for a category showcase preview. */
export function buildCategoryPreviewPath(apiValue: string): string {
  const params = new URLSearchParams({
    limit: "1",
    select: CATEGORY_PREVIEW_SELECT,
  });

  return `/products/category/${encodeURIComponent(apiValue)}?${params.toString()}`;
}
