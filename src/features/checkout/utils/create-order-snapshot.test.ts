import { describe, expect, it } from "vitest";

import type { AuthSession } from "@/features/auth/types/auth";
import type { CartItem } from "@/features/cart/types/cart-item";

import type { CheckoutFormValues } from "../schemas/checkout.schema";
import { createOrderSnapshot } from "./create-order-snapshot";
import { generateOrderId } from "./generate-order-id";

const items: CartItem[] = [
  {
    productId: 1,
    slug: "iphone-1",
    title: "iPhone",
    price: 100,
    image: "https://cdn.dummyjson.com/phone.jpg",
    quantity: 2,
  },
  {
    productId: 2,
    slug: "watch-2",
    title: "Watch",
    price: 50,
    image: "https://cdn.dummyjson.com/watch.jpg",
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
  paymentMethod: "cash_on_delivery",
};

const session: AuthSession = {
  token: "access-token",
  user: { id: 1, username: "emilys", firstName: "Emily", email: "emily@example.com" },
};

describe("generateOrderId", () => {
  it("generates a deterministic demo order id", () => {
    const createdAt = new Date(Date.UTC(2026, 8, 18, 12, 0, 0));
    expect(generateOrderId(createdAt, "1:emilys")).toBe(
      generateOrderId(createdAt, "1:emilys"),
    );
    expect(generateOrderId(createdAt, "1:emilys")).toMatch(/^BAY-20260918-\d{4}$/);
  });
});

describe("createOrderSnapshot", () => {
  it("snapshots cart items with quantities and totals", () => {
    const createdAt = new Date(Date.UTC(2026, 8, 18, 12, 0, 0));
    const order = createOrderSnapshot({ values, items, session, createdAt });

    expect(order).not.toBeNull();
    expect(order?.items).toHaveLength(2);
    expect(order?.items[0]?.quantity).toBe(2);
    expect(order?.items[0]?.subtotal).toBe(200);
    expect(order?.subtotal).toBe(250);
    expect(order?.shipping).toBe(0);
    expect(order?.total).toBe(250);
    expect(order?.id).toMatch(/^BAY-20260918-\d{4}$/);
  });

  it("attaches authenticated user data safely", () => {
    const order = createOrderSnapshot({ values, items, session });
    expect(order?.userId).toBe(1);
    expect(order?.username).toBe("emilys");
  });

  it("cannot create an order from an empty cart", () => {
    expect(createOrderSnapshot({ values, items: [], session })).toBeNull();
  });
});
