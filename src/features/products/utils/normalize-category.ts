import type { Category } from "../types/category";

/** Convert a DummyJSON category slug (e.g. mens-shirts) to a message key suffix (mensShirts). */
export function slugToMessageKey(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/['\u2019\u2018]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalize a product category string (already a DummyJSON slug in practice)
 * into the BAIANAT Category domain model.
 */
export function normalizeCategory(apiValue: string): Category {
  const slug = toSlug(apiValue) || "unknown";
  const messageKey = slugToMessageKey(slug) || "unknown";

  return {
    apiValue,
    slug,
    labelKey: `categories.${messageKey}`,
  };
}

/** Map a DummyJSON category list DTO into the BAIANAT Category model. */
export function normalizeCategoryDto(dto: { slug: string; name: string }): Category {
  const slug = toSlug(dto.slug) || "unknown";
  const messageKey = slugToMessageKey(slug) || "unknown";

  return {
    apiValue: dto.slug,
    slug,
    labelKey: `categories.${messageKey}`,
  };
}
