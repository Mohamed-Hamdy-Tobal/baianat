import { describe, expect, it } from "vitest";

import { buildRobotsConfig, buildSitemapEntries } from "@/lib/seo/sitemap";
import { getSiteOrigin } from "@/lib/seo/urls";

describe("seo sitemap and robots", () => {
  it("includes localized static, category, and product URLs", () => {
    const entries = buildSitemapEntries({
      productSlugs: ["iphone-15-pro-1"],
      categorySlugs: ["beauty"],
    });

    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${getSiteOrigin()}/en`);
    expect(urls).toContain(`${getSiteOrigin()}/ar`);
    expect(urls).toContain(`${getSiteOrigin()}/en/products`);
    expect(urls).toContain(`${getSiteOrigin()}/ar/products`);
    expect(urls).toContain(`${getSiteOrigin()}/en/categories`);
    expect(urls).toContain(`${getSiteOrigin()}/ar/categories`);
    expect(urls).toContain(`${getSiteOrigin()}/en/about`);
    expect(urls).toContain(`${getSiteOrigin()}/en/contact`);
    expect(urls).toContain(`${getSiteOrigin()}/en/categories/beauty`);
    expect(urls).toContain(`${getSiteOrigin()}/ar/categories/beauty`);
    expect(urls).toContain(`${getSiteOrigin()}/en/products/iphone-15-pro-1`);
    expect(urls).toContain(`${getSiteOrigin()}/ar/products/iphone-15-pro-1`);
  });

  it("covers both locales for every public path", () => {
    const entries = buildSitemapEntries({
      productSlugs: ["item-1"],
      categorySlugs: ["beauty"],
    });

    const en = entries.filter((entry) => entry.url.includes("/en/"));
    const ar = entries.filter((entry) => entry.url.includes("/ar/"));
    const enHome = entries.filter((entry) => entry.url.endsWith("/en"));
    const arHome = entries.filter((entry) => entry.url.endsWith("/ar"));

    expect(enHome).toHaveLength(1);
    expect(arHome).toHaveLength(1);
    expect(en.length).toBe(ar.length);
  });

  it("does not include private routes or query strings", () => {
    const urls = buildSitemapEntries({
      productSlugs: ["item-1"],
      categorySlugs: ["beauty"],
    }).map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/login"))).toBe(false);
    expect(urls.some((url) => url.includes("/cart"))).toBe(false);
    expect(urls.some((url) => url.includes("/checkout"))).toBe(false);
    expect(urls.some((url) => url.includes("?"))).toBe(false);
  });

  it("configures robots to allow public crawl and disallow private locales", () => {
    const robots = buildRobotsConfig();

    expect(robots.sitemap).toBe(`${getSiteOrigin()}/sitemap.xml`);
    expect(robots.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
    });

    const disallow = Array.isArray(robots.rules)
      ? robots.rules[0]?.disallow
      : robots.rules.disallow;

    expect(disallow).toEqual(
      expect.arrayContaining([
        "/en/login",
        "/ar/login",
        "/en/register",
        "/ar/cart",
        "/en/wishlist",
        "/ar/checkout",
        "/en/checkout/success",
      ]),
    );
  });
});
