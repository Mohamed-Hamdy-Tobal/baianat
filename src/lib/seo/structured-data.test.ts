import { describe, expect, it } from "vitest";

import type { ProductDetails } from "@/features/products/types/product";
import {
  breadcrumbJsonLd,
  productJsonLd,
  serializeJsonLd,
} from "@/lib/seo/structured-data";
import { getSiteOrigin } from "@/lib/seo/urls";

function makeProduct(overrides: Partial<ProductDetails> = {}): ProductDetails {
  return {
    id: 1,
    slug: "iphone-15-pro-1",
    title: "iPhone 15 Pro",
    description: "A premium smartphone.",
    price: 1000,
    discountPercentage: 10,
    category: { slug: "smartphones", apiValue: "smartphones", labelKey: "categories.smartphones" },
    image: "https://cdn.dummyjson.com/product/1.webp",
    brand: "Apple",
    stock: 3,
    availabilityStatus: "In Stock",
    rating: { rate: 4.8, count: 20 },
    images: ["https://cdn.dummyjson.com/product/1.webp"],
    sku: "SKU-1",
    tags: [],
    weight: null,
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

describe("seo structured data", () => {
  it("builds Product JSON-LD with offer and rating when available", () => {
    const data = productJsonLd(makeProduct(), "en");

    expect(data["@type"]).toBe("Product");
    expect(data.name).toBe("iPhone 15 Pro");
    expect(data.sku).toBe("SKU-1");
    expect(data.brand).toEqual({ "@type": "Brand", name: "Apple" });
    expect(data.offers).toMatchObject({
      "@type": "Offer",
      priceCurrency: "USD",
      price: "900.00",
      availability: "https://schema.org/InStock",
      url: `${getSiteOrigin()}/en/products/iphone-15-pro-1`,
    });
    expect(data.aggregateRating).toEqual({
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 20,
    });
  });

  it("omits unavailable Product JSON-LD fields", () => {
    const data = productJsonLd(
      makeProduct({
        brand: null,
        sku: null,
        images: [],
        description: "   ",
        rating: { rate: 0, count: 0 },
        stock: 0,
      }),
      "en",
    );

    expect(data.brand).toBeUndefined();
    expect(data.sku).toBeUndefined();
    expect(data.image).toBeUndefined();
    expect(data.description).toBeUndefined();
    expect(data.aggregateRating).toBeUndefined();
    expect((data.offers as { availability: string }).availability).toBe(
      "https://schema.org/OutOfStock",
    );
  });

  it("only includes AggregateRating when review count is positive", () => {
    const withRating = productJsonLd(makeProduct({ rating: { rate: 4, count: 1 } }), "en");
    const withoutRating = productJsonLd(makeProduct({ rating: { rate: 4, count: 0 } }), "en");

    expect(withRating.aggregateRating).toBeDefined();
    expect(withoutRating.aggregateRating).toBeUndefined();
  });

  it("builds BreadcrumbList with absolute localized URLs", () => {
    const data = breadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "iPhone 15 Pro" },
      ],
      "ar",
    );

    expect(data["@type"]).toBe("BreadcrumbList");
    const items = data.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      position: 1,
      name: "Home",
      item: `${getSiteOrigin()}/ar`,
    });
    expect(items[1]).toMatchObject({
      position: 2,
      name: "Products",
      item: `${getSiteOrigin()}/ar/products`,
    });
    expect(items[2].item).toBeUndefined();
    expect(items[2].name).toBe("iPhone 15 Pro");
  });

  it("serializes JSON-LD safely without raw HTML breakout", () => {
    const serialized = serializeJsonLd({
      "@type": "Product",
      name: "</script><script>alert(1)</script>",
    });

    expect(serialized).toContain("\\u003c");
    expect(serialized).not.toContain("</script>");
    expect(JSON.parse(serialized.replace(/\\u003c/g, "<")).name).toContain("alert");
  });
});
