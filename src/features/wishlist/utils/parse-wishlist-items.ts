import { z } from "zod";

import type { WishlistItem } from "../types/wishlist-item";

const ratingSchema = z
  .object({
    rate: z.number().finite().nonnegative(),
    count: z.number().int().nonnegative(),
  })
  .optional();

const wishlistItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  price: z.number().finite().nonnegative(),
  image: z.string().min(1),
  rating: ratingSchema,
});

/**
 * Recover a valid WishlistItem[] from unknown persisted state.
 * Drops invalid rows; returns [] for malformed payloads.
 */
export function parseWishlistItems(value: unknown): WishlistItem[] {
  if (!Array.isArray(value)) return [];

  const items: WishlistItem[] = [];
  const seen = new Set<number>();

  for (const entry of value) {
    const parsed = wishlistItemSchema.safeParse(entry);
    if (!parsed.success) continue;
    if (seen.has(parsed.data.productId)) continue;
    seen.add(parsed.data.productId);
    items.push(parsed.data);
  }

  return items;
}
