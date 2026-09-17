import { describe, expect, it } from "vitest";

import { buildCategoryPreviewPath } from "./build-category-preview-path";

describe("buildCategoryPreviewPath", () => {
  it("builds a lightweight category preview URL", () => {
    expect(buildCategoryPreviewPath("mens-shirts")).toBe(
      "/products/category/mens-shirts?limit=1&select=thumbnail%2Ctitle",
    );
  });

  it("encodes api values safely", () => {
    expect(buildCategoryPreviewPath("skin-care")).toContain("/products/category/skin-care?");
    expect(buildCategoryPreviewPath("a/b")).toContain("/products/category/a%2Fb?");
  });
});
