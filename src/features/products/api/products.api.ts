import "server-only";

import { CATALOGUE_FETCH_OPTIONS, request } from "@/lib/api/http";

import { toProductDetails, toProductSummaries, toProductSummary } from "../mappers/product.mapper";
import {
  productDetailsDtoSchema,
  productMetaIndexResponseSchema,
  productsPageResponseSchema,
  productStaticParamsResponseSchema,
  productSummaryDtoSchema,
  LISTING_SELECT,
} from "../schemas/product.schema";
import type { ProductDetails, ProductSummary } from "../types/product";
import { buildProductsPath } from "../utils/build-products-path";
import {
  PAGE_SIZE,
  totalPages,
  type ProductPageResult,
  type ProductQuery,
} from "../utils/product-query";
import { buildProductSlug } from "../utils/product-slug";

export async function getProductPage(query: ProductQuery): Promise<ProductPageResult> {
  // DummyJSON has no combined search+category endpoint. When both are set, fetch the full
  // search result set, filter by category, then paginate in memory.
  if (query.q && query.category) {
    const path = buildProductsPath(
      { ...query, page: 1 },
      { limit: 0, skip: 0, select: LISTING_SELECT },
    );
    const response = await request(path, {
      ...CATALOGUE_FETCH_OPTIONS,
      schema: productsPageResponseSchema,
    });

    const filtered = response.products.filter((product) => product.category === query.category);
    const total = filtered.length;
    const start = (query.page - 1) * PAGE_SIZE;
    const pageSlice = filtered.slice(start, start + PAGE_SIZE);

    return {
      products: toProductSummaries(pageSlice),
      total,
      page: query.page,
      pageSize: PAGE_SIZE,
      totalPages: totalPages(total),
    };
  }

  const path = buildProductsPath(query);
  const response = await request(path, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productsPageResponseSchema,
  });

  return {
    products: toProductSummaries(response.products),
    total: response.total,
    page: query.page,
    pageSize: PAGE_SIZE,
    totalPages: totalPages(response.total),
  };
}

/**
 * Latest products by meta.updatedAt.
 * DummyJSON ignores sortBy=updatedAt, so we load a slim id+meta index, sort, then hydrate 4 cards.
 */
export async function getLatestProducts(limit = 4): Promise<ProductSummary[]> {
  const index = await request("/products?limit=0&select=id,meta", {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productMetaIndexResponseSchema,
  });

  const latestIds = [...index.products]
    .sort((a, b) => Date.parse(b.meta.updatedAt) - Date.parse(a.meta.updatedAt))
    .slice(0, limit)
    .map((product) => product.id);

  const products = await Promise.all(latestIds.map((id) => getProductSummaryById(id)));
  return products;
}

export async function getProductSummaryById(id: number): Promise<ProductSummary> {
  const dto = await request(`/products/${id}?select=${LISTING_SELECT}`, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productSummaryDtoSchema,
  });
  return toProductSummary(dto);
}

export async function getProductById(id: number): Promise<ProductDetails> {
  const dto = await request(`/products/${id}`, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productDetailsDtoSchema,
  });
  return toProductDetails(dto);
}

export async function getRelatedProducts(
  categoryApiValue: string,
  excludeId: number,
  limit = 4,
): Promise<ProductSummary[]> {
  const path = buildProductsPath(
    { page: 1, sort: "default", category: categoryApiValue },
    { limit: limit + 4, skip: 0, select: LISTING_SELECT },
  );
  const response = await request(path, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productsPageResponseSchema,
  });

  return toProductSummaries(response.products.filter((product) => product.id !== excludeId)).slice(
    0,
    limit,
  );
}

/** @deprecated Prefer getProductPage */
export async function getProducts(): Promise<ProductSummary[]> {
  const path = buildProductsPath({ page: 1, sort: "default" }, { limit: 0, skip: 0 });
  const response = await request(path, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productsPageResponseSchema,
  });
  return toProductSummaries(response.products);
}

/** @deprecated Prefer getProductPage with category */
export async function getProductsByCategory(apiValue: string): Promise<ProductSummary[]> {
  const path = buildProductsPath(
    { page: 1, sort: "default", category: apiValue },
    { limit: 0, skip: 0 },
  );
  const response = await request(path, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productsPageResponseSchema,
  });
  return toProductSummaries(response.products);
}

export async function getProductSlugParams(): Promise<Array<{ slug: string }>> {
  const response = await request("/products?limit=0&select=id,title", {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productStaticParamsResponseSchema,
  });

  return response.products.map((product) => ({
    slug: buildProductSlug(product.title, product.id),
  }));
}
