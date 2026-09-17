import type { AuthSession } from "@/features/auth/types/auth";
import type { CartItem } from "@/features/cart/types/cart-item";

import type { CheckoutFormValues } from "../schemas/checkout.schema";
import type { PlaceOrderResult } from "../types/order";
import { createOrderSnapshot } from "./create-order-snapshot";

export type PlaceCheckoutOrderInput = {
  values: CheckoutFormValues;
  items: CartItem[];
  session: AuthSession | null;
  /** When true, a previous submission is still in flight. */
  submitting: boolean;
  createdAt?: Date;
};

/**
 * Pure local order placement for the demo checkout.
 * Does not mutate cart/auth stores — the UI clears the cart only after success.
 */
export function placeCheckoutOrder(input: PlaceCheckoutOrderInput): PlaceOrderResult {
  if (input.submitting) {
    return { ok: false, error: "duplicate" };
  }

  if (!input.session) {
    return { ok: false, error: "unauthenticated" };
  }

  if (input.items.length === 0) {
    return { ok: false, error: "empty_cart" };
  }

  try {
    const order = createOrderSnapshot({
      values: input.values,
      items: input.items,
      session: input.session,
      createdAt: input.createdAt,
    });

    if (!order) {
      return { ok: false, error: "empty_cart" };
    }

    return { ok: true, order };
  } catch {
    return { ok: false, error: "unknown" };
  }
}
