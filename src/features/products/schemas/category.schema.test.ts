import { describe, expect, it } from "vitest";

import { categoryListSchema, categoryPreviewPageSchema } from "./category.schema";

const validCategory = {
  slug: "smartphones",
  name: "Smartphones",
  url: "https://dummyjson.com/products/category/smartphones",
};

describe("categoryListSchema", () => {
  it("accepts a DummyJSON category object array", () => {
    const result = categoryListSchema.safeParse([validCategory]);
    expect(result.success).toBe(true);
  });

  it("rejects a bare string array", () => {
    expect(categoryListSchema.safeParse(["smartphones"]).success).toBe(false);
  });

  it("rejects non-arrays", () => {
    expect(categoryListSchema.safeParse(validCategory).success).toBe(false);
  });

  it("rejects objects missing slug", () => {
    const result = categoryListSchema.safeParse([{ name: "Smartphones", url: validCategory.url }]);
    expect(result.success).toBe(false);
  });
});

describe("categoryPreviewPageSchema", () => {
  it("accepts a lightweight preview envelope", () => {
    const result = categoryPreviewPageSchema.safeParse({
      products: [{ thumbnail: "https://cdn.dummyjson.com/x.jpg", title: "A" }],
      total: 5,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty products with a total", () => {
    const result = categoryPreviewPageSchema.safeParse({ products: [], total: 0 });
    expect(result.success).toBe(true);
  });
});
