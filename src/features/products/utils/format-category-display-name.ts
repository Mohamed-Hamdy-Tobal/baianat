/**
 * Humanize a DummyJSON category slug for display when no i18n key exists.
 * Supports unknown/future slugs without a hardcoded category list.
 */
export function formatCategoryDisplayName(slug: string): string {
  const parts = slug
    .trim()
    .toLowerCase()
    .split("-")
    .filter(Boolean);

  if (parts.length === 0) return "Unknown";

  return parts
    .map((part) => {
      if (part === "mens") return "Men's";
      if (part === "womens") return "Women's";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
