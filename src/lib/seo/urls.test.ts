import { describe, expect, it } from "vitest";

import {
  absoluteImageUrl,
  absoluteUrl,
  catalogueUrl,
  categoryUrl,
  getSiteOrigin,
  isSafeRelativePath,
  languageAlternates,
  localizedUrl,
  productUrl,
} from "@/lib/seo/urls";

describe("seo urls", () => {
  it("normalizes the site origin without a trailing slash", () => {
    expect(getSiteOrigin()).not.toMatch(/\/$/);
    expect(getSiteOrigin()).toMatch(/^https?:\/\//);
  });

  it("builds absolute URLs from safe relative paths", () => {
    expect(absoluteUrl("/en/products")).toBe(`${getSiteOrigin()}/en/products`);
    expect(absoluteUrl("/en")).toBe(`${getSiteOrigin()}/en`);
  });

  it("builds localized URLs including the locale prefix", () => {
    expect(localizedUrl("en", "/")).toBe(`${getSiteOrigin()}/en`);
    expect(localizedUrl("ar", "/")).toBe(`${getSiteOrigin()}/ar`);
    expect(localizedUrl("en", "/products")).toBe(`${getSiteOrigin()}/en/products`);
    expect(localizedUrl("ar", "/products")).toBe(`${getSiteOrigin()}/ar/products`);
  });

  it("builds canonical product and catalogue URLs", () => {
    expect(productUrl("en", "iphone-15-pro-1")).toBe(
      `${getSiteOrigin()}/en/products/iphone-15-pro-1`,
    );
    expect(productUrl("ar", "iphone-15-pro-1")).toBe(
      `${getSiteOrigin()}/ar/products/iphone-15-pro-1`,
    );
    expect(catalogueUrl("en")).toBe(`${getSiteOrigin()}/en/products`);
    expect(categoryUrl("ar", "beauty")).toBe(`${getSiteOrigin()}/ar/categories/beauty`);
  });

  it("generates reciprocal hreflang URLs including x-default", () => {
    const languages = languageAlternates("/products");
    expect(languages.en).toBe(`${getSiteOrigin()}/en/products`);
    expect(languages.ar).toBe(`${getSiteOrigin()}/ar/products`);
    expect(languages["x-default"]).toBe(`${getSiteOrigin()}/en/products`);
  });

  it("never emits unsafe or external hosts as site URLs", () => {
    expect(isSafeRelativePath("//evil.com")).toBe(false);
    expect(isSafeRelativePath("https://evil.com")).toBe(false);
    expect(isSafeRelativePath("javascript:alert(1)")).toBe(false);
    expect(isSafeRelativePath("/en/products")).toBe(true);

    expect(() => absoluteUrl("https://evil.com")).toThrow(/Unsafe/);
    expect(() => absoluteUrl("//evil.com")).toThrow(/Unsafe/);
    expect(() => localizedUrl("en", "https://evil.com")).toThrow(/Unsafe/);
    expect(() => productUrl("en", "../evil")).toThrow(/Unsafe/);
    expect(() => categoryUrl("en", "a/b")).toThrow(/Unsafe/);
  });

  it("only accepts absolute http(s) image URLs", () => {
    expect(absoluteImageUrl("https://cdn.dummyjson.com/a.jpg")).toBe(
      "https://cdn.dummyjson.com/a.jpg",
    );
    expect(absoluteImageUrl("/relative.jpg")).toBeUndefined();
    expect(absoluteImageUrl("javascript:alert(1)")).toBeUndefined();
    expect(absoluteImageUrl(null)).toBeUndefined();
    expect(absoluteImageUrl("")).toBeUndefined();
  });
});
