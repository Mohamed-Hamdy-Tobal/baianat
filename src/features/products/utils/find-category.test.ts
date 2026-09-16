import { describe, expect, it } from "vitest";

import type { Category } from "../types/category";
import { categoryMessageKey, findCategoryBySlug } from "./find-category";

const categories: Category[] = [
  { slug: "electronics", apiValue: "electronics", labelKey: "categories.electronics" },
  { slug: "mens-clothing", apiValue: "men's clothing", labelKey: "categories.mensClothing" },
];

describe("findCategoryBySlug", () => {
  it("returns the matching category", () => {
    expect(findCategoryBySlug(categories, "electronics")).toEqual(categories[0]);
  });

  it("returns undefined for unknown slugs", () => {
    expect(findCategoryBySlug(categories, "unknown")).toBeUndefined();
  });
});

describe("categoryMessageKey", () => {
  it("strips the categories namespace prefix", () => {
    expect(categoryMessageKey("categories.mensClothing")).toBe("mensClothing");
  });
});
