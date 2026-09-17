import type { CartItem } from "@/features/cart/types/cart-item";
import { getCartSubtotal } from "@/features/cart/utils/cart-calculations";

/** Demo rule: free shipping for all take-home checkout orders. */
export function calculateShipping(): number {
  return 0;
}

export function calculateOrderSubtotal(items: CartItem[]): number {
  return getCartSubtotal(items);
}

export function calculateOrderTotal(items: CartItem[]): number {
  const subtotal = calculateOrderSubtotal(items);
  const shipping = calculateShipping();
  return Math.round((subtotal + shipping) * 100) / 100;
}
