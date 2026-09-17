import { describe, expect, it } from "vitest";

import type { Product } from "../types/product";
import { parseProductSort, sortProducts } from "./sort-products";

const category = {
  slug: "electronics",
  apiValue: "electronics",
  labelKey: "categories.electronics",
};

const products: Product[] = [
  {
    id: 1,
    slug: "a-1",
    title: "A",
    description: "",
    price: 20,
    discountPercentage: 0,
    category,
    image: "",
    brand: null,
    stock: 10,
    availabilityStatus: null,
    rating: { rate: 3, count: 10 },
  },
  {
    id: 2,
    slug: "b-2",
    title: "B",
    description: "",
    price: 10,
    discountPercentage: 0,
    category,
    image: "",
    brand: null,
    stock: 10,
    availabilityStatus: null,
    rating: { rate: 5, count: 2 },
  },
  {
    id: 3,
    slug: "c-3",
    title: "C",
    description: "",
    price: 30,
    discountPercentage: 0,
    category,
    image: "",
    brand: null,
    stock: 10,
    availabilityStatus: null,
    rating: { rate: 4, count: 5 },
  },
];

describe("parseProductSort", () => {
  it("defaults to featured for unknown values", () => {
    expect(parseProductSort(undefined)).toBe("featured");
    expect(parseProductSort("nope")).toBe("featured");
  });

  it("accepts known sort values", () => {
    expect(parseProductSort("price-asc")).toBe("price-asc");
  });
});

describe("sortProducts", () => {
  it("keeps API order for featured", () => {
    expect(sortProducts(products, "featured").map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it("sorts by price ascending and descending", () => {
    expect(sortProducts(products, "price-asc").map((p) => p.id)).toEqual([2, 1, 3]);
    expect(sortProducts(products, "price-desc").map((p) => p.id)).toEqual([3, 1, 2]);
  });

  it("sorts by rating descending", () => {
    expect(sortProducts(products, "rating").map((p) => p.id)).toEqual([2, 3, 1]);
  });
});
