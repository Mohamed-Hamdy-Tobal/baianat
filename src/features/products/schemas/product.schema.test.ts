import { describe, expect, it } from "vitest";

import {
  productDetailsDtoSchema,
  productSummaryDtoSchema,
  productsPageResponseSchema,
} from "./product.schema";

const validSummary = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description: "A popular mascara.",
  category: "beauty",
  price: 9.99,
  rating: 4.94,
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
};

describe("productSummaryDtoSchema", () => {
  it("accepts listing DTOs and defaults discount/stock", () => {
    const result = productSummaryDtoSchema.safeParse(validSummary);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.discountPercentage).toBe(0);
      expect(result.data.stock).toBe(0);
    }
  });
});

describe("productDetailsDtoSchema", () => {
  it("accepts full detail payloads and strips nothing required for mapping", () => {
    const result = productDetailsDtoSchema.safeParse({
      ...validSummary,
      images: ["https://cdn.dummyjson.com/a.jpg"],
      reviews: [
        {
          rating: 5,
          comment: "Nice",
          date: "2026-01-01",
          reviewerName: "Ada",
          reviewerEmail: "ada@example.com",
        },
      ],
      meta: { updatedAt: "2026-01-01T00:00:00.000Z", barcode: "123" },
    });

    expect(result.success).toBe(true);
  });
});

describe("productsPageResponseSchema", () => {
  it("accepts a page envelope", () => {
    const result = productsPageResponseSchema.safeParse({
      products: [validSummary],
      total: 1,
      skip: 0,
      limit: 20,
    });
    expect(result.success).toBe(true);
  });
});
