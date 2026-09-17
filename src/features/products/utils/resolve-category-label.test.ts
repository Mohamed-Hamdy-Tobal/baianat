import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveCategoryLabel } from "./resolve-category-label";

describe("resolveCategoryLabel", () => {
  it("uses i18n when the key exists", () => {
    const t = Object.assign((key: string) => `translated:${key}`, {
      has: (key: string) => key === "beauty",
    });

    expect(
      resolveCategoryLabel(t, { slug: "beauty", labelKey: "categories.beauty" }),
    ).toBe("translated:beauty");
  });

  it("falls back to humanized slug for unknown keys", () => {
    const t = Object.assign((key: string) => key, {
      has: () => false,
    });

    expect(
      resolveCategoryLabel(t, {
        slug: "new-future-category",
        labelKey: "categories.newFutureCategory",
      }),
    ).toBe("New Future Category");
  });
});

describe("category list hardcoding guard", () => {
  it("does not ship a hardcoded DummyJSON category slug array in the API module", () => {
    const source = readFileSync(
      new URL("../api/categories.api.ts", import.meta.url),
      "utf8",
    );

    expect(source).toContain('"/products/categories"');
    expect(source).not.toMatch(/\[\s*"beauty"\s*,\s*"fragrances"/);
  });
});
