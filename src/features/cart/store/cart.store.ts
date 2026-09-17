"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem, CartProductInput } from "../types/cart-item";
import {
  addCartItem,
  clearCartItems,
  decrementCartItem,
  incrementCartItem,
  removeCartItem,
  updateCartQuantity,
} from "../utils/cart-items";
import { getCartItemCount, getCartSubtotal, isCartEmpty } from "../utils/cart-calculations";
import { parseCartItems } from "../utils/parse-cart-items";
import { toCartItem, toCartItemFromSnapshot } from "../utils/to-cart-item";
import { MIN_QUANTITY } from "../utils/quantity";

type CartState = {
  items: CartItem[];
  addItem: (product: CartProductInput, quantity?: number) => void;
  /** Merge a pre-built cart snapshot (e.g. from wishlist). */
  addSnapshot: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  isEmpty: () => boolean;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = MIN_QUANTITY) => {
        const snapshot = toCartItem(product, quantity);
        if (!snapshot) return;
        set((state) => ({ items: addCartItem(state.items, snapshot) }));
      },

      addSnapshot: (item, quantity = MIN_QUANTITY) => {
        const snapshot = toCartItemFromSnapshot(item, quantity);
        if (!snapshot) return;
        set((state) => ({ items: addCartItem(state.items, snapshot) }));
      },

      removeItem: (productId) => {
        set((state) => ({ items: removeCartItem(state.items, productId) }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({ items: updateCartQuantity(state.items, productId, quantity) }));
      },

      increment: (productId) => {
        set((state) => ({ items: incrementCartItem(state.items, productId) }));
      },

      decrement: (productId) => {
        set((state) => ({ items: decrementCartItem(state.items, productId) }));
      },

      clearCart: () => {
        set({ items: clearCartItems() });
      },

      totalItems: () => getCartItemCount(get().items),
      subtotal: () => getCartSubtotal(get().items),
      isEmpty: () => isCartEmpty(get().items),
    }),
    {
      name: "baianat-cart",
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
          items: parseCartItems(raw),
        };
      },
    },
  ),
);
