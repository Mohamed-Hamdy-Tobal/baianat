import { describe, expect, it } from "vitest";

import { normalizeCategory, normalizeCategoryDto, slugToMessageKey } from "./normalize-category";

describe("slugToMessageKey", () => {
  it("camelCases hyphenated slugs", () => {
    expect(slugToMessageKey("mens-shirts")).toBe("mensShirts");
    expect(slugToMessageKey("home-decoration")).toBe("homeDecoration");
    expect(slugToMessageKey("beauty")).toBe("beauty");
  });
});

describe("normalizeCategory", () => {
  it("maps DummyJSON product category strings", () => {
    expect(normalizeCategory("smartphones")).toEqual({
      apiValue: "smartphones",
      slug: "smartphones",
      labelKey: "categories.smartphones",
    });

    expect(normalizeCategory("womens-jewellery")).toEqual({
      apiValue: "womens-jewellery",
      slug: "womens-jewellery",
      labelKey: "categories.womensJewellery",
    });
  });

  it("builds a safe fallback for unknown values", () => {
    expect(normalizeCategory("Home & Garden")).toEqual({
      apiValue: "Home & Garden",
      slug: "home-garden",
      labelKey: "categories.homeGarden",
    });
  });
});

describe("normalizeCategoryDto", () => {
  it("maps DummyJSON category list DTOs", () => {
    expect(
      normalizeCategoryDto({
        slug: "kitchen-accessories",
        name: "Kitchen Accessories",
      }),
    ).toEqual({
      apiValue: "kitchen-accessories",
      slug: "kitchen-accessories",
      labelKey: "categories.kitchenAccessories",
    });
  });
});
