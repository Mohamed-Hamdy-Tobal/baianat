import type { CartItem } from "@/features/cart/types/cart-item";

import type { WishlistItem } from "../types/wishlist-item";

/** Convert a wishlist snapshot into a cart line input (quantity applied separately). */
export function toCartSnapshotFromWishlist(item: WishlistItem): Omit<CartItem, "quantity"> {
  return {
    productId: item.productId,
    slug: item.slug,
    title: item.title,
    price: item.price,
    image: item.image,
  };
}
