import type { WishlistItem } from "../types/wishlist-item";

export function isInWishlist(items: WishlistItem[], productId: number): boolean {
  return items.some((item) => item.productId === productId);
}

/** Add item if missing; ignore duplicates (unique by productId). */
export function addWishlistItem(items: WishlistItem[], item: WishlistItem): WishlistItem[] {
  if (isInWishlist(items, item.productId)) return items;
  return [...items, item];
}

export function removeWishlistItem(items: WishlistItem[], productId: number): WishlistItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function toggleWishlistItem(items: WishlistItem[], item: WishlistItem): WishlistItem[] {
  if (isInWishlist(items, item.productId)) {
    return removeWishlistItem(items, item.productId);
  }
  return addWishlistItem(items, item);
}

export function clearWishlistItems(): WishlistItem[] {
  return [];
}

export function isWishlistEmpty(items: WishlistItem[]): boolean {
  return items.length === 0;
}
