export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['\u2019\u2018]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildProductSlug(title: string, id: number): string {
  return `${slugify(title)}-${id}`;
}

export function parseProductSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  const id = Number(match[1]);
  return Number.isFinite(id) ? id : null;
}
