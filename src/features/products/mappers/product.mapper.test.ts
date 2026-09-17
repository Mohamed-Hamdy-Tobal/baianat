import { describe, expect, it } from "vitest";

import { toProductDetails, toProductSummary, toProductSummaries } from "./product.mapper";

const summaryDto = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description: "A popular mascara.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10,
  rating: 4.94,
  stock: 5,
  brand: "Essence",
  availabilityStatus: "In Stock",
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  reviews: [{}, {}, {}],
};

describe("toProductSummary", () => {
  it("maps listing fields onto ProductSummary", () => {
    const product = toProductSummary(summaryDto);

    expect(product).toEqual({
      id: 1,
      slug: "essence-mascara-lash-princess-1",
      title: "Essence Mascara Lash Princess",
      description: "A popular mascara.",
      price: 9.99,
      discountPercentage: 10,
      category: {
        apiValue: "beauty",
        slug: "beauty",
        labelKey: "categories.beauty",
      },
      image: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      brand: "Essence",
      stock: 5,
      availabilityStatus: "In Stock",
      rating: { rate: 4.94, count: 3 },
    });
  });

  it("defaults optional listing fields", () => {
    const product = toProductSummary({
      id: 2,
      title: "Plain",
      description: "d",
      category: "mens-watches",
      price: 1,
      discountPercentage: 0,
      rating: 4,
      stock: 0,
      thumbnail: "https://cdn.dummyjson.com/x.jpg",
    });

    expect(product.discountPercentage).toBe(0);
    expect(product.brand).toBeNull();
    expect(product.stock).toBe(0);
    expect(product.rating.count).toBe(0);
    expect(product.category.labelKey).toBe("categories.mensWatches");
  });
});

describe("toProductDetails", () => {
  it("maps detail fields and reviews without email", () => {
    const product = toProductDetails({
      ...summaryDto,
      images: ["https://cdn.dummyjson.com/a.jpg", "https://cdn.dummyjson.com/b.jpg"],
      sku: "SKU-1",
      tags: ["beauty", "mascara"],
      weight: 1.2,
      dimensions: { width: 1, height: 2, depth: 3 },
      warrantyInformation: "1 year",
      shippingInformation: "Ships in 1 day",
      returnPolicy: "30 days",
      minimumOrderQuantity: 1,
      meta: { updatedAt: "2026-01-01T00:00:00.000Z", barcode: "123" },
      reviews: [
        {
          rating: 5,
          comment: "Great",
          date: "2026-01-02T00:00:00.000Z",
          reviewerName: "Ada",
          reviewerEmail: "ada@example.com",
        },
      ],
    });

    expect(product.images).toHaveLength(2);
    expect(product.sku).toBe("SKU-1");
    expect(product.barcode).toBe("123");
    expect(product.updatedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(product.reviews).toEqual([
      {
        rating: 5,
        comment: "Great",
        date: "2026-01-02T00:00:00.000Z",
        reviewerName: "Ada",
      },
    ]);
    expect(product.rating.count).toBe(1);
  });

  it("falls back to thumbnail when images are empty", () => {
    const product = toProductDetails({
      ...summaryDto,
      images: [],
      tags: [],
      reviews: [],
    });
    expect(product.images).toEqual([summaryDto.thumbnail]);
  });
});

describe("toProductSummaries", () => {
  it("maps a list and supports related exclusion slicing", () => {
    const products = toProductSummaries([
      summaryDto,
      { ...summaryDto, id: 2, title: "Another" },
      { ...summaryDto, id: 3, title: "Third" },
    ]);
    const related = products.filter((product) => product.id !== 1).slice(0, 4);
    expect(related).toHaveLength(2);
    expect(related.every((product) => product.id !== 1)).toBe(true);
  });
});
