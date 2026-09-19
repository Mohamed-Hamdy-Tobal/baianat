"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  parseCheckoutDetails,
  type CheckoutShippingDetails,
} from "../utils/parse-checkout-details";

type CheckoutDetailsState = {
  details: CheckoutShippingDetails | null;
  setCheckoutDetails: (details: CheckoutShippingDetails) => void;
  clearCheckoutDetails: () => void;
};

/**
 * Demo persistence for checkout shipping fields (localStorage).
 * Payment method is intentionally not stored.
 */
export const useCheckoutDetailsStore = create<CheckoutDetailsState>()(
  persist(
    (set) => ({
      details: null,

      setCheckoutDetails: (details) => {
        set({ details });
      },

      clearCheckoutDetails: () => {
        set({ details: null });
      },
    }),
    {
      name: "baianat-checkout-details",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ details: state.details }),
      merge: (persisted, current) => {
        const raw =
          persisted && typeof persisted === "object" && "details" in persisted
            ? (persisted as { details: unknown }).details
            : undefined;
        return {
          ...current,
          details: parseCheckoutDetails(raw),
        };
      },
    },
  ),
);
