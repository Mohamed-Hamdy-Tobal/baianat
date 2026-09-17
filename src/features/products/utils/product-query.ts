export const PAGE_SIZE = 20;

export const PRODUCT_SORT_OPTIONS = [
  "default",
  "newest",
  "price-asc",
  "price-desc",
  "rating-desc",
  "title-asc",
  "title-desc",
] as const;

export type ProductSortOption = (typeof PRODUCT_SORT_OPTIONS)[number];

export const UPDATED_PRESETS = ["", "7d", "30d", "90d"] as const;
export type UpdatedPreset = (typeof UPDATED_PRESETS)[number];

export type ProductQuery = {
  page: number;
  q?: string;
  category?: string;
  sort: ProductSortOption;
  updated?: Exclude<UpdatedPreset, "">;
};

export type ProductPageResult = {
  products: import("../types/product").ProductSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function sortToApi(sort: ProductSortOption): { sortBy?: string; order?: "asc" | "desc" } {
  switch (sort) {
    case "price-asc":
      return { sortBy: "price", order: "asc" };
    case "price-desc":
      return { sortBy: "price", order: "desc" };
    case "rating-desc":
      return { sortBy: "rating", order: "desc" };
    case "title-asc":
      return { sortBy: "title", order: "asc" };
    case "title-desc":
      return { sortBy: "title", order: "desc" };
    case "newest":
      // DummyJSON ignores sortBy=updatedAt; id desc is the supported recency proxy for list sort.
      return { sortBy: "id", order: "desc" };
    default:
      return {};
  }
}

export function updatedPresetToIso(preset: Exclude<UpdatedPreset, "">, now = new Date()): string {
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const date = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

export function parseProductSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ProductQuery {
  const get = (key: string) => {
    const value = raw[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const pageRaw = Number(get("page") ?? "1");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  const q = get("q")?.trim() || undefined;
  const category = get("category")?.trim() || undefined;

  const sortRaw = get("sort") ?? "default";
  const sort = PRODUCT_SORT_OPTIONS.includes(sortRaw as ProductSortOption)
    ? (sortRaw as ProductSortOption)
    : "default";

  const updatedRaw = get("updated") ?? "";
  const updated = UPDATED_PRESETS.includes(updatedRaw as UpdatedPreset)
    ? (updatedRaw as UpdatedPreset)
    : "";

  return {
    page,
    q,
    category,
    sort,
    updated: updated || undefined,
  };
}

export function serializeProductSearchParams(query: ProductQuery): Record<string, string> {
  const params: Record<string, string> = {};

  if (query.page > 1) params.page = String(query.page);
  if (query.q) params.q = query.q;
  if (query.category) params.category = query.category;
  if (query.sort !== "default") params.sort = query.sort;
  if (query.updated) params.updated = query.updated;

  return params;
}

export function totalPages(total: number, pageSize = PAGE_SIZE): number {
  if (total <= 0) return 0;
  return Math.ceil(total / pageSize);
}
