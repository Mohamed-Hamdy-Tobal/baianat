import { discountedPrice } from "@/features/products/utils/pricing";

import type { CartItem, CartProductInput } from "../types/cart-item";
import { MIN_QUANTITY, normalizeQuantity } from "./quantity";

export function toCartItem(product: CartProductInput, quantity: number = MIN_QUANTITY): CartItem | null {
  const qty = normalizeQuantity(quantity);
  if (qty === null || qty === 0) return null;

  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: discountedPrice(product.price, product.discountPercentage),
    image: product.image,
    quantity: qty,
  };
}

export function toCartItemFromSnapshot(
  snapshot: Omit<CartItem, "quantity">,
  quantity: number = MIN_QUANTITY,
): CartItem | null {
  const qty = normalizeQuantity(quantity);
  if (qty === null || qty === 0) return null;

  return {
    ...snapshot,
    quantity: qty,
  };
}
