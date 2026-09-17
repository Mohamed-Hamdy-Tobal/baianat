import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import {
  categoryUrl,
  getSiteOrigin,
  localizedUrl,
  productUrl,
} from "@/lib/seo/urls";

const STATIC_PATHS = ["/", "/products", "/categories", "/about", "/contact"] as const;

/**
 * Build the public sitemap URL list.
 * Pure helper so tests can assert locale coverage without hitting DummyJSON.
 */
export function buildSitemapEntries(input: {
  productSlugs: string[];
  categorySlugs: string[];
}): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: localizedUrl(locale, path) });
    }

    for (const slug of input.categorySlugs) {
      entries.push({ url: categoryUrl(locale, slug) });
    }

    for (const slug of input.productSlugs) {
      entries.push({ url: productUrl(locale, slug) });
    }
  }

  return entries;
}

const PRIVATE_SEGMENTS = [
  "/login",
  "/register",
  "/cart",
  "/wishlist",
  "/checkout",
  "/checkout/success",
] as const;

export function buildRobotsConfig(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  const disallow = routing.locales.flatMap((locale) =>
    PRIVATE_SEGMENTS.map((segment) => `/${locale}${segment}`),
  );

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
