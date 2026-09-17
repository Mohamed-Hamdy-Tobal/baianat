"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { WishlistItem, WishlistProductInput } from "../types/wishlist-item";
import { parseWishlistItems } from "../utils/parse-wishlist-items";
import { toWishlistItem } from "../utils/to-wishlist-item";
import {
  addWishlistItem,
  clearWishlistItems,
  isInWishlist as isInWishlistItems,
  removeWishlistItem,
  toggleWishlistItem,
} from "../utils/wishlist-items";

type WishlistState = {
  items: WishlistItem[];
  addItem: (product: WishlistProductInput) => void;
  removeItem: (productId: number) => void;
  toggleItem: (product: WishlistProductInput) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: number) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const snapshot = toWishlistItem(product);
        set((state) => ({ items: addWishlistItem(state.items, snapshot) }));
      },

      removeItem: (productId) => {
        set((state) => ({ items: removeWishlistItem(state.items, productId) }));
      },

      toggleItem: (product) => {
        const snapshot = toWishlistItem(product);
        set((state) => ({ items: toggleWishlistItem(state.items, snapshot) }));
      },

      clearWishlist: () => {
        set({ items: clearWishlistItems() });
      },

      isInWishlist: (productId) => isInWishlistItems(get().items, productId),
    }),
    {
      name: "baianat-wishlist",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === "object" && "items" in persisted
            ? (persisted as { items: unknown }).items
            : undefined;
        return {
          ...current,
          items: parseWishlistItems(raw),
        };
      },
    },
  ),
);
