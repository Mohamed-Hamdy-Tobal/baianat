import { LISTING_SELECT } from "../schemas/product.schema";
import {
  sortToApi,
  updatedPresetToIso,
  type ProductQuery,
  PAGE_SIZE,
} from "./product-query";

type BuildOptions = {
  select?: string;
  /** Override limit/skip (e.g. limit=0 for combined q+category). */
  limit?: number;
  skip?: number;
};

/**
 * Builds a DummyJSON path + query string from a ProductQuery.
 * Endpoint rules:
 * - q → /products/search
 * - else category → /products/category/{slug}
 * - else → /products
 */
export function buildProductsPath(query: ProductQuery, options: BuildOptions = {}): string {
  const params = new URLSearchParams();
  const { sortBy, order } = sortToApi(query.sort);

  const limit = options.limit ?? PAGE_SIZE;
  const skip = options.skip ?? (query.page - 1) * PAGE_SIZE;

  params.set("limit", String(limit));
  params.set("skip", String(skip));

  if (sortBy) params.set("sortBy", sortBy);
  if (order) params.set("order", order);

  if (query.updated) {
    params.set("modifiedAfter", updatedPresetToIso(query.updated));
  }

  if (options.select) {
    params.set("select", options.select);
  } else {
    params.set("select", LISTING_SELECT);
  }

  if (query.q) {
    params.set("q", query.q);
    return `/products/search?${params.toString()}`;
  }

  if (query.category) {
    return `/products/category/${encodeURIComponent(query.category)}?${params.toString()}`;
  }

  return `/products?${params.toString()}`;
}

export { LISTING_SELECT };
