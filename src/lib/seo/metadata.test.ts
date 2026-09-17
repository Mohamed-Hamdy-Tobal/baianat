import { describe, expect, it } from "vitest";

import type { ProductDetails } from "@/features/products/types/product";
import {
  isFilteredCatalogueQuery,
  privatePageMetadata,
  productPageMetadata,
  truncateDescription,
} from "@/lib/seo/metadata";
import { getSiteOrigin } from "@/lib/seo/urls";

function makeProduct(overrides: Partial<ProductDetails> = {}): ProductDetails {
  return {
    id: 1,
    slug: "iphone-15-pro-1",
    title: "iPhone 15 Pro",
    description: "A premium smartphone with a sharp display and lasting battery.",
    price: 999,
    discountPercentage: 10,
    category: { slug: "smartphones", apiValue: "smartphones", labelKey: "categories.smartphones" },
    image: "https://cdn.dummyjson.com/product/1.webp",
    brand: "Apple",
    stock: 5,
    availabilityStatus: "In Stock",
    rating: { rate: 4.5, count: 12 },
    images: ["https://cdn.dummyjson.com/product/1.webp"],
    sku: "IPHONE-15-PRO",
    tags: ["phone"],
    weight: 1,
    dimensions: null,
    warrantyInformation: null,
    shippingInformation: null,
    returnPolicy: null,
    minimumOrderQuantity: null,
    barcode: null,
    reviews: [],
    updatedAt: null,
    ...overrides,
  };
}

describe("seo metadata", () => {
  it("truncates descriptions without cutting mid-word when possible", () => {
    const long = "word ".repeat(50).trim();
    const truncated = truncateDescription(long, 40);
    expect(truncated.length).toBeLessThanOrEqual(40);
    expect(truncated.endsWith("…")).toBe(true);
    expect(truncated).not.toContain("  ");
  });

  it("builds product metadata with canonical and hreflang", () => {
    const meta = productPageMetadata({
      locale: "en",
      product: makeProduct(),
      siteName: "BAIANAT",
    });

    expect(meta.title).toBe("iPhone 15 Pro");
    expect(meta.description).toContain("premium smartphone");
    expect(meta.alternates?.canonical).toBe(`${getSiteOrigin()}/en/products/iphone-15-pro-1`);
    expect(meta.alternates?.languages).toEqual({
      en: `${getSiteOrigin()}/en/products/iphone-15-pro-1`,
      ar: `${getSiteOrigin()}/ar/products/iphone-15-pro-1`,
      "x-default": `${getSiteOrigin()}/en/products/iphone-15-pro-1`,
    });
    expect(meta.openGraph?.url).toBe(`${getSiteOrigin()}/en/products/iphone-15-pro-1`);
    expect((meta.openGraph as { type?: string } | undefined)?.type).toBe("website");
    expect((meta.twitter as { card?: string } | undefined)?.card).toBe("summary_large_image");
  });

  it("builds Arabic product metadata with ar locale and reciprocal hreflang", () => {
    const meta = productPageMetadata({
      locale: "ar",
      product: makeProduct(),
      siteName: "بيان",
    });

    expect(meta.alternates?.canonical).toBe(`${getSiteOrigin()}/ar/products/iphone-15-pro-1`);
    expect(meta.openGraph?.locale).toBe("ar");
    expect(meta.alternates?.languages?.en).toBe(
      `${getSiteOrigin()}/en/products/iphone-15-pro-1`,
    );
    expect(meta.alternates?.languages?.ar).toBe(
      `${getSiteOrigin()}/ar/products/iphone-15-pro-1`,
    );
  });

  it("marks private pages as noindex nofollow without hreflang", () => {
    const meta = privatePageMetadata({
      title: "Log in",
      description: "Sign in to continue.",
    });

    expect(meta.robots).toEqual({ index: false, follow: false });
    expect(meta.alternates).toBeUndefined();
  });

  it("detects filtered catalogue query params", () => {
    expect(isFilteredCatalogueQuery({})).toBe(false);
    expect(isFilteredCatalogueQuery({ page: "1" })).toBe(false);
    expect(isFilteredCatalogueQuery({ page: "2" })).toBe(true);
    expect(isFilteredCatalogueQuery({ q: "phone" })).toBe(true);
    expect(isFilteredCatalogueQuery({ category: "beauty" })).toBe(true);
    expect(isFilteredCatalogueQuery({ sort: "price-asc" })).toBe(true);
  });
});
