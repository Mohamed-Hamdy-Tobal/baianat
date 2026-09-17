"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Order } from "../types/order";
import { parseLastOrder } from "../utils/parse-last-order";

type OrderState = {
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
  clearLastOrder: () => void;
};

/**
 * Lightweight demo order persistence — keeps only the latest completed order.
 * Not a real ecommerce order history backend.
 */
export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,

      setLastOrder: (order) => {
        set({ lastOrder: order });
      },

      clearLastOrder: () => {
        set({ lastOrder: null });
      },
    }),
    {
      name: "baianat-order",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ lastOrder: state.lastOrder }),
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === "object" && "lastOrder" in persisted
            ? (persisted as { lastOrder: unknown }).lastOrder
            : undefined;
        return {
          ...current,
          lastOrder: parseLastOrder(raw),
        };
      },
    },
  ),
);
