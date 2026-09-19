import { describe, expect, it } from "vitest";

import { resolveAvailabilityKey } from "@/features/products/utils/resolve-availability";

describe("resolveAvailabilityKey", () => {
  it("returns inStock when stock is positive", () => {
    expect(resolveAvailabilityKey(1)).toBe("inStock");
    expect(resolveAvailabilityKey(12)).toBe("inStock");
  });

  it("returns outOfStock when stock is zero or negative", () => {
    expect(resolveAvailabilityKey(0)).toBe("outOfStock");
    expect(resolveAvailabilityKey(-1)).toBe("outOfStock");
  });
});
