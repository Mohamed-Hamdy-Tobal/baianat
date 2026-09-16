import type { Product } from "../types/product";

export const PRODUCT_SORT_VALUES = ["featured", "price-asc", "price-desc", "rating"] as const;

export type ProductSort = (typeof PRODUCT_SORT_VALUES)[number];

export function parseProductSort(value: string | undefined | null): ProductSort {
  if (value && PRODUCT_SORT_VALUES.includes(value as ProductSort)) {
    return value as ProductSort;
  }

  return "featured";
}

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  if (sort === "featured") {
    return products;
  }

  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating.rate - a.rating.rate);
      break;
  }

  return sorted;
}
