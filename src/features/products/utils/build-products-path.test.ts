import { describe, expect, it } from "vitest";

import { buildProductsPath } from "./build-products-path";

describe("buildProductsPath", () => {
  it("uses search endpoint when q is set", () => {
    const path = buildProductsPath({ page: 1, sort: "default", q: "phone" });
    expect(path.startsWith("/products/search?")).toBe(true);
    expect(path).toContain("q=phone");
    expect(path).toContain("limit=20");
    expect(path).toContain("skip=0");
  });

  it("uses category endpoint when category is set without q", () => {
    const path = buildProductsPath({ page: 2, sort: "price-desc", category: "beauty" });
    expect(path.startsWith("/products/category/beauty?")).toBe(true);
    expect(path).toContain("skip=20");
    expect(path).toContain("sortBy=price");
    expect(path).toContain("order=desc");
  });

  it("uses list endpoint otherwise", () => {
    const path = buildProductsPath({ page: 1, sort: "newest", updated: "7d" });
    expect(path.startsWith("/products?")).toBe(true);
    expect(path).toContain("sortBy=id");
    expect(path).toContain("order=desc");
    expect(path).toContain("modifiedAfter=");
  });
});
