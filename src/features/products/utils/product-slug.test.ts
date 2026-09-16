import { describe, expect, it } from "vitest";

import { buildProductSlug, parseProductSlug, slugify } from "./product-slug";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Mens Casual Premium")).toBe("mens-casual-premium");
  });

  it("strips apostrophes", () => {
    expect(slugify("men's clothing")).toBe("mens-clothing");
    expect(slugify("women\u2019s jacket")).toBe("womens-jacket");
  });

  it("replaces punctuation with hyphens", () => {
    expect(slugify("Solid Gold Petite Micropave.")).toBe("solid-gold-petite-micropave");
  });

  it("collapses repeated separators and trims edges", () => {
    expect(slugify("  ---Hello---World!!!  ")).toBe("hello-world");
  });
});

describe("buildProductSlug / parseProductSlug", () => {
  it("builds a title-id slug", () => {
    expect(buildProductSlug("Fjallraven Backpack", 1)).toBe("fjallraven-backpack-1");
  });

  it("round-trips the trailing numeric id", () => {
    const slug = buildProductSlug("men's cotton jacket", 3);
    expect(parseProductSlug(slug)).toBe(3);
  });

  it("returns null when no trailing id is present", () => {
    expect(parseProductSlug("no-id-here")).toBeNull();
    expect(parseProductSlug("")).toBeNull();
  });
});
