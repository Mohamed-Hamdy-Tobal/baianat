import { describe, expect, it } from "vitest";

import { productSchema, productsSchema } from "./product.schema";

const validProduct = {
  id: 1,
  title: "Fjallraven Backpack",
  price: 109.95,
  description: "Your perfect pack for everyday use.",
  category: "men's clothing",
  image: "https://example.com/image.jpg",
  rating: { rate: 3.9, count: 120 },
};

describe("productSchema", () => {
  it("accepts a valid FakeStore product", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("accepts a product without rating", () => {
    const withoutRating = {
      id: validProduct.id,
      title: validProduct.title,
      price: validProduct.price,
      description: validProduct.description,
      category: validProduct.category,
      image: validProduct.image,
    };
    const result = productSchema.safeParse(withoutRating);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = productSchema.safeParse({ id: 1, title: "Only title" });
    expect(result.success).toBe(false);
  });

  it("rejects wrong field types", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      price: "109.95",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an array of products", () => {
    const result = productsSchema.safeParse([validProduct]);
    expect(result.success).toBe(true);
  });
});
