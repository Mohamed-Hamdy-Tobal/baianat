"use client";

import { useCartStore } from "@/features/cart/store/cart.store";
import { CartItemRow } from "./cart-item-row";

export function CartItemList() {
  const items = useCartStore((state) => state.items);

  return (
    <ul className="flex flex-col gap-3" role="list">
      {items.map((item) => (
        <CartItemRow key={item.productId} item={item} />
      ))}
    </ul>
  );
}
