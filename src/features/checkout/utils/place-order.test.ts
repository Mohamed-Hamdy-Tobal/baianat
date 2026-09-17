import { describe, expect, it } from "vitest";

import type { AuthSession } from "@/features/auth/types/auth";
import type { CartItem } from "@/features/cart/types/cart-item";

import type { CheckoutFormValues } from "../schemas/checkout.schema";
import { placeCheckoutOrder } from "./place-order";

const items: CartItem[] = [
  {
    productId: 1,
    slug: "iphone-1",
    title: "iPhone",
    price: 100,
    image: "https://cdn.dummyjson.com/phone.jpg",
    quantity: 1,
  },
];

const values: CheckoutFormValues = {
  firstName: "Emily",
  lastName: "Johnson",
  email: "emily@example.com",
  phone: "+1 555 0100",
  address: "1 Demo St",
  city: "Cairo",
  country: "Egypt",
  paymentMethod: "card",
};

const session: AuthSession = {
  token: "access-token",
  user: { id: 1, username: "emilys" },
};

describe("placeCheckoutOrder", () => {
  it("creates an order when authenticated with a non-empty cart", () => {
    const result = placeCheckoutOrder({
      values,
      items,
      session,
      submitting: false,
      createdAt: new Date(Date.UTC(2026, 8, 18)),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.total).toBe(100);
      expect(result.order.userId).toBe(1);
    }
  });

  it("rejects unauthenticated placement", () => {
    const result = placeCheckoutOrder({
      values,
      items,
      session: null,
      submitting: false,
    });
    expect(result).toEqual({ ok: false, error: "unauthenticated" });
  });

  it("rejects empty cart", () => {
    const result = placeCheckoutOrder({
      values,
      items: [],
      session,
      submitting: false,
    });
    expect(result).toEqual({ ok: false, error: "empty_cart" });
  });

  it("prevents duplicate submission while in flight", () => {
    const result = placeCheckoutOrder({
      values,
      items,
      session,
      submitting: true,
    });
    expect(result).toEqual({ ok: false, error: "duplicate" });
  });
});
