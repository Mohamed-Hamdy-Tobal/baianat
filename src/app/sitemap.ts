import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/features/products";
import { buildSitemapEntries } from "@/lib/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productSlugs: string[] = [];
  let categorySlugs: string[] = [];

  try {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    productSlugs = products.map((product) => product.slug);
    categorySlugs = categories.map((category) => category.slug);
  } catch {
    // Still emit static public URLs so builds do not fail when DummyJSON is down.
  }

  return buildSitemapEntries({ productSlugs, categorySlugs });
}
