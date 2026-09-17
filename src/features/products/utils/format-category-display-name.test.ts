import { describe, expect, it } from "vitest";

import { formatCategoryDisplayName } from "./format-category-display-name";

describe("formatCategoryDisplayName", () => {
  it("title-cases hyphenated slugs", () => {
    expect(formatCategoryDisplayName("home-decoration")).toBe("Home Decoration");
    expect(formatCategoryDisplayName("mobile-accessories")).toBe("Mobile Accessories");
    expect(formatCategoryDisplayName("beauty")).toBe("Beauty");
  });

  it("expands mens and womens possessives", () => {
    expect(formatCategoryDisplayName("mens-shirts")).toBe("Men's Shirts");
    expect(formatCategoryDisplayName("womens-jewellery")).toBe("Women's Jewellery");
  });

  it("humanizes unknown future slugs without a hardcoded list", () => {
    expect(formatCategoryDisplayName("new-future-category")).toBe("New Future Category");
  });

  it("handles empty input", () => {
    expect(formatCategoryDisplayName("")).toBe("Unknown");
    expect(formatCategoryDisplayName("   ")).toBe("Unknown");
  });
});
