import { describe, expect, it } from "vitest";

import { isNavActive } from "./primary-nav";

describe("isNavActive", () => {
  it("matches home only on exact root", () => {
    expect(isNavActive("/", "/")).toBe(true);
    expect(isNavActive("/categories", "/")).toBe(false);
  });

  it("matches nested paths for non-home routes", () => {
    expect(isNavActive("/categories", "/categories")).toBe(true);
    expect(isNavActive("/categories/electronics", "/categories")).toBe(true);
    expect(isNavActive("/about", "/categories")).toBe(false);
  });
});
