import type { CartItem } from "../types/cart-item";
import { MAX_QUANTITY, MIN_QUANTITY, normalizeQuantity } from "./quantity";

function clampMergedQuantity(quantity: number): number {
  if (quantity > MAX_QUANTITY) return MAX_QUANTITY;
  if (quantity < MIN_QUANTITY) return MIN_QUANTITY;
  return quantity;
}

/** Add a new line or merge quantity into an existing productId row. */
export function addCartItem(items: CartItem[], item: CartItem): CartItem[] {
  const qty = normalizeQuantity(item.quantity);
  if (qty === null || qty === 0) return items;

  const existingIndex = items.findIndex((entry) => entry.productId === item.productId);

  if (existingIndex === -1) {
    return [...items, { ...item, quantity: clampMergedQuantity(qty) }];
  }

  return items.map((entry, index) => {
    if (index !== existingIndex) return entry;
    return {
      ...entry,
      quantity: clampMergedQuantity(entry.quantity + qty),
    };
  });
}

export function removeCartItem(items: CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

/**
 * Set absolute quantity for a product.
 * - quantity 0 → remove
 * - invalid → no-op
 * - missing product → no-op
 */
export function updateCartQuantity(items: CartItem[], productId: number, quantity: unknown): CartItem[] {
  const qty = normalizeQuantity(quantity);
  if (qty === null) return items;
  if (qty === 0) return removeCartItem(items, productId);

  const exists = items.some((item) => item.productId === productId);
  if (!exists) return items;

  return items.map((item) => (item.productId === productId ? { ...item, quantity: qty } : item));
}

export function incrementCartItem(items: CartItem[], productId: number): CartItem[] {
  const existing = items.find((item) => item.productId === productId);
  if (!existing) return items;
  return updateCartQuantity(items, productId, existing.quantity + 1);
}

export function decrementCartItem(items: CartItem[], productId: number): CartItem[] {
  const existing = items.find((item) => item.productId === productId);
  if (!existing) return items;
  if (existing.quantity <= MIN_QUANTITY) return items;
  return updateCartQuantity(items, productId, existing.quantity - 1);
}

export function clearCartItems(): CartItem[] {
  return [];
}
