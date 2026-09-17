import type { CartItem } from "../types/cart-item";

export function getCartItemSubtotal(item: CartItem): number {
  return Math.round(item.price * item.quantity * 100) / 100;
}

export function getCartSubtotal(items: CartItem[]): number {
  const total = items.reduce((sum, item) => sum + getCartItemSubtotal(item), 0);
  return Math.round(total * 100) / 100;
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function isCartEmpty(items: CartItem[]): boolean {
  return items.length === 0;
}
