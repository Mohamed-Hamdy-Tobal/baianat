import { describe, expect, it } from "vitest";

import { discountedPrice, hasDiscount } from "./pricing";

describe("pricing", () => {
  it("detects discounts and computes sale price", () => {
    expect(hasDiscount(0)).toBe(false);
    expect(hasDiscount(10)).toBe(true);
    expect(discountedPrice(100, 10)).toBe(90);
  });
});
