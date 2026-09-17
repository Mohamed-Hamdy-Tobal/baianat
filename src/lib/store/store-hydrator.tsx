"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/store/cart.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";

/**
 * Manually rehydrate Zustand persist stores (skipHydration: true).
 * Mount once in the app shell so localStorage is never read during SSR.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
  }, []);

  return null;
}
