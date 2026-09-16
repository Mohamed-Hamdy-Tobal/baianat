import { describe, expect, it } from "vitest";

import { categoryListSchema } from "./category.schema";

describe("categoryListSchema", () => {
  it("accepts a valid string array", () => {
    const result = categoryListSchema.safeParse([
      "electronics",
      "jewelery",
      "men's clothing",
      "women's clothing",
    ]);
    expect(result.success).toBe(true);
  });

  it("rejects non-arrays", () => {
    expect(categoryListSchema.safeParse("electronics").success).toBe(false);
    expect(categoryListSchema.safeParse({ category: "electronics" }).success).toBe(false);
  });

  it("rejects empty strings in the array", () => {
    const result = categoryListSchema.safeParse(["electronics", ""]);
    expect(result.success).toBe(false);
  });

  it("rejects arrays with non-string values", () => {
    const result = categoryListSchema.safeParse(["electronics", 42]);
    expect(result.success).toBe(false);
  });
});
