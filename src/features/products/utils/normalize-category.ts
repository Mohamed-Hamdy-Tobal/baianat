import type { Category } from "../types/category";

const KNOWN_CATEGORIES: Record<string, Omit<Category, "apiValue">> = {
  electronics: {
    slug: "electronics",
    labelKey: "categories.electronics",
  },
  jewelery: {
    slug: "jewelery",
    labelKey: "categories.jewelery",
  },
  "men's clothing": {
    slug: "mens-clothing",
    labelKey: "categories.mensClothing",
  },
  "women's clothing": {
    slug: "womens-clothing",
    labelKey: "categories.womensClothing",
  },
};

function fallbackSlug(apiValue: string): string {
  return apiValue
    .toLowerCase()
    .replace(/['\u2019\u2018]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeCategory(apiValue: string): Category {
  const known = KNOWN_CATEGORIES[apiValue];

  if (known) {
    return {
      apiValue,
      slug: known.slug,
      labelKey: known.labelKey,
    };
  }

  const slug = fallbackSlug(apiValue) || "unknown";

  return {
    apiValue,
    slug,
    labelKey: `categories.${slug}`,
  };
}
