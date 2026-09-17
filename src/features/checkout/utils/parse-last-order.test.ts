import { describe, expect, it } from "vitest";

import type { Order } from "../types/order";
import { parseLastOrder } from "./parse-last-order";

const validOrder: Order = {
  id: "BAY-20260918-4821",
  createdAt: "2026-09-18T12:00:00.000Z",
  userId: 1,
  username: "emilys",
  customer: {
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily@example.com",
    phone: "+1 555 0100",
    address: "1 Demo St",
    city: "Cairo",
    country: "Egypt",
  },
  items: [
    {
      productId: 1,
      slug: "iphone-1",
      title: "iPhone",
      image: "https://cdn.dummyjson.com/phone.jpg",
      price: 100,
      quantity: 1,
      subtotal: 100,
    },
  ],
  paymentMethod: "card",
  subtotal: 100,
  shipping: 0,
  total: 100,
};

describe("parseLastOrder", () => {
  it("accepts a well-formed order", () => {
    expect(parseLastOrder(validOrder)).toEqual(validOrder);
  });

  it("recovers safely from malformed persisted state", () => {
    expect(parseLastOrder(null)).toBeNull();
    expect(parseLastOrder(undefined)).toBeNull();
    expect(parseLastOrder({})).toBeNull();
    expect(parseLastOrder({ ...validOrder, items: [] })).toBeNull();
    expect(parseLastOrder({ ...validOrder, paymentMethod: "bitcoin" })).toBeNull();
    expect(parseLastOrder({ ...validOrder, id: "" })).toBeNull();
  });
});
