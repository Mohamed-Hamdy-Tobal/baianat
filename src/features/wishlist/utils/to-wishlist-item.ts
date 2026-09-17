import { discountedPrice } from "@/features/products/utils/pricing";

import type { WishlistItem, WishlistProductInput } from "../types/wishlist-item";

export function toWishlistItem(product: WishlistProductInput): WishlistItem {
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: discountedPrice(product.price, product.discountPercentage),
    image: product.image,
    rating: product.rating,
  };
}
