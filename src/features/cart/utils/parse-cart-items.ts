import { z } from "zod";

import type { CartItem } from "../types/cart-item";
import { MAX_QUANTITY, MIN_QUANTITY } from "./quantity";

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  price: z.number().finite().nonnegative(),
  image: z.string().min(1),
  quantity: z.number().int().min(MIN_QUANTITY).max(MAX_QUANTITY),
});

/**
 * Recover a valid CartItem[] from unknown persisted state.
 * Drops invalid rows; returns [] for malformed payloads.
 */
export function parseCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const items: CartItem[] = [];
  const seen = new Set<number>();

  for (const entry of value) {
    const parsed = cartItemSchema.safeParse(entry);
    if (!parsed.success) continue;
    if (seen.has(parsed.data.productId)) continue;
    seen.add(parsed.data.productId);
    items.push(parsed.data);
  }

  return items;
}
