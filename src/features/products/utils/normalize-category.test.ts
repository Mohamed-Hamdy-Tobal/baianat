import { describe, expect, it } from "vitest";

import { normalizeCategory } from "./normalize-category";

describe("normalizeCategory", () => {
  it("maps all known FakeStore categories", () => {
    expect(normalizeCategory("electronics")).toEqual({
      apiValue: "electronics",
      slug: "electronics",
      labelKey: "categories.electronics",
    });

    expect(normalizeCategory("jewelery")).toEqual({
      apiValue: "jewelery",
      slug: "jewelery",
      labelKey: "categories.jewelery",
    });

    expect(normalizeCategory("men's clothing")).toEqual({
      apiValue: "men's clothing",
      slug: "mens-clothing",
      labelKey: "categories.mensClothing",
    });

    expect(normalizeCategory("women's clothing")).toEqual({
      apiValue: "women's clothing",
      slug: "womens-clothing",
      labelKey: "categories.womensClothing",
    });
  });

  it("preserves apiValue for unknown categories and builds a safe fallback", () => {
    expect(normalizeCategory("home & garden")).toEqual({
      apiValue: "home & garden",
      slug: "home-garden",
      labelKey: "categories.home-garden",
    });
  });
});
