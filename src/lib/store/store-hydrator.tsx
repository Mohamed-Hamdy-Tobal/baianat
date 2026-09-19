"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useCheckoutDetailsStore } from "@/features/checkout/store/checkout-details.store";
import { useOrderStore } from "@/features/checkout/store/order.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";

/**
 * Manually rehydrate Zustand persist stores (skipHydration: true).
 * Mount once in the app shell so localStorage is never read during SSR.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
    void useAuthStore.persist.rehydrate();
    void useOrderStore.persist.rehydrate();
    void useCheckoutDetailsStore.persist.rehydrate();
  }, []);

  return null;
}
