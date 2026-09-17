import { describe, expect, it } from "vitest";

import { toCategoryPreview } from "./category-preview.mapper";

const category = {
  slug: "beauty",
  apiValue: "beauty",
  labelKey: "categories.beauty",
};

describe("toCategoryPreview", () => {
  it("maps total and thumbnail from the page envelope", () => {
    const preview = toCategoryPreview(category, {
      products: [{ thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg", title: "A" }],
      total: 12,
    });

    expect(preview).toEqual({
      slug: "beauty",
      apiValue: "beauty",
      labelKey: "categories.beauty",
      productCount: 12,
      image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
    });
  });

  it("handles missing page and missing thumbnail gracefully", () => {
    expect(toCategoryPreview(category, null)).toEqual({
      ...category,
      productCount: 0,
      image: null,
    });

    expect(
      toCategoryPreview(category, {
        products: [{ title: "No image" }],
        total: 3,
      }),
    ).toMatchObject({ productCount: 3, image: null });

    expect(
      toCategoryPreview(category, {
        products: [{ thumbnail: "   " }],
        total: 1,
      }),
    ).toMatchObject({ image: null });
  });
});
