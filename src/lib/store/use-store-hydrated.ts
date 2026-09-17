"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";

const emptySubscribe = () => () => {};

/** True only after hydration; avoids SSR/client mismatches for client-only UI. */
function useIsClient(): boolean {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

function subscribeHydration(onStoreChange: () => void) {
  const unsubCart = useCartStore.persist.onFinishHydration(onStoreChange);
  const unsubWishlist = useWishlistStore.persist.onFinishHydration(onStoreChange);
  const unsubAuth = useAuthStore.persist.onFinishHydration(onStoreChange);
  return () => {
    unsubCart();
    unsubWishlist();
    unsubAuth();
  };
}

function getHydrationSnapshot() {
  return (
    useCartStore.persist.hasHydrated() &&
    useWishlistStore.persist.hasHydrated() &&
    useAuthStore.persist.hasHydrated()
  );
}

function getServerHydrationSnapshot() {
  return false;
}

/**
 * True only after the component has hydrated on the client AND all persist
 * stores have rehydrated. The client gate prevents soft-navigation mismatches
 * when stores were already hydrated from a previous page.
 */
export function useStoreHydrated(): boolean {
  const isClient = useIsClient();
  const storesHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );

  return isClient && storesHydrated;
}
