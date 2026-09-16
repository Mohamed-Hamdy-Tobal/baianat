import { describe, expect, it } from "vitest";

import { toProduct, toProducts } from "./product.mapper";

const baseDto = {
  id: 2,
  title: "Mens Casual Premium Slim Fit T-Shirts",
  price: 22.3,
  description: "Slim-fitting style.",
  category: "men's clothing",
  image: "https://example.com/tshirt.jpg",
};

describe("toProduct", () => {
  it("maps DTO fields onto the domain model", () => {
    const product = toProduct({
      ...baseDto,
      rating: { rate: 4.1, count: 259 },
    });

    expect(product).toEqual({
      id: 2,
      slug: "mens-casual-premium-slim-fit-t-shirts-2",
      title: "Mens Casual Premium Slim Fit T-Shirts",
      description: "Slim-fitting style.",
      price: 22.3,
      category: {
        apiValue: "men's clothing",
        slug: "mens-clothing",
        labelKey: "categories.mensClothing",
      },
      image: "https://example.com/tshirt.jpg",
      rating: { rate: 4.1, count: 259 },
    });
  });

  it("defaults missing rating to zeros", () => {
    const product = toProduct(baseDto);
    expect(product.rating).toEqual({ rate: 0, count: 0 });
  });

  it("normalizes category into the slug/labelKey/apiValue triple", () => {
    const product = toProduct({
      ...baseDto,
      category: "jewelery",
    });

    expect(product.category).toEqual({
      apiValue: "jewelery",
      slug: "jewelery",
      labelKey: "categories.jewelery",
    });
  });
});

describe("toProducts", () => {
  it("maps a list of DTOs", () => {
    const products = toProducts([baseDto, { ...baseDto, id: 3, title: "Another" }]);
    expect(products).toHaveLength(2);
    expect(products[0]?.slug).toBe("mens-casual-premium-slim-fit-t-shirts-2");
    expect(products[1]?.slug).toBe("another-3");
  });
});
