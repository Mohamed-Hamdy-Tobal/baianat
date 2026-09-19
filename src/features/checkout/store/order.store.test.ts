import { beforeEach, describe, expect, it } from "vitest";

import type { Order } from "../types/order";

const memory = new Map<string, string>();

const localStorageMock: Storage = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
  removeItem: (key: string) => {
    memory.delete(key);
  },
  clear: () => {
    memory.clear();
  },
  key: (index: number) => Array.from(memory.keys())[index] ?? null,
  get length() {
    return memory.size;
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  configurable: true,
  writable: true,
});

Object.defineProperty(globalThis, "window", {
  value: globalThis,
  configurable: true,
  writable: true,
});

const { useCartStore } = await import("@/features/cart/store/cart.store");
const { useOrderStore } = await import("../store/order.store");
const { placeCheckoutOrder } = await import("../utils/place-order");

const order: Order = {
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

describe("useOrderStore", () => {
  beforeEach(() => {
    memory.clear();
    useOrderStore.setState({ lastOrder: null });
    useCartStore.setState({ items: [] });
  });

  it("persists the latest order", () => {
    useOrderStore.getState().setLastOrder(order);
    expect(useOrderStore.getState().lastOrder?.id).toBe("BAY-20260918-4821");
  });

  it("clears the latest order", () => {
    useOrderStore.getState().setLastOrder(order);
    useOrderStore.getState().clearLastOrder();
    expect(useOrderStore.getState().lastOrder).toBeNull();
  });

  it("clears cart only after a successful place-order orchestration", () => {
    useCartStore.getState().addItem(
      {
        id: 1,
        slug: "iphone-1",
        title: "iPhone",
        price: 100,
        discountPercentage: 0,
        image: "https://cdn.dummyjson.com/phone.jpg",
      },
      1,
    );

    const failed = placeCheckoutOrder({
      values: {
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily@example.com",
        phone: "+1 555 0100",
        address: "1 Demo St",
        city: "Cairo",
        country: "Egypt",
        paymentMethod: "card",
      },
      items: useCartStore.getState().items,
      session: null,
      submitting: false,
    });

    expect(failed.ok).toBe(false);
    // UI must not clear cart on failure.
    expect(useCartStore.getState().items).toHaveLength(1);

    const success = placeCheckoutOrder({
      values: {
        firstName: "Emily",
        lastName: "Johnson",
        email: "emily@example.com",
        phone: "+1 555 0100",
        address: "1 Demo St",
        city: "Cairo",
        country: "Egypt",
        paymentMethod: "card",
      },
      items: useCartStore.getState().items,
      session: { token: "t", user: { id: 1, username: "emilys" } },
      submitting: false,
    });

    expect(success.ok).toBe(true);
    if (success.ok) {
      // Mirrors checkout-form: persist order first; cart clear happens after success navigation.
      useOrderStore.getState().setLastOrder(success.order);
      useCartStore.getState().clearCart();
    }

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useOrderStore.getState().lastOrder?.id).toBeTruthy();
  });

  it("recovers from malformed persisted order state on merge", () => {
    memory.set(
      "baianat-order",
      JSON.stringify({ state: { lastOrder: { id: "" } }, version: 0 }),
    );

    const merged = useOrderStore.persist.getOptions().merge?.(
      { lastOrder: { id: "" } },
      { lastOrder: null, setLastOrder: () => undefined, clearLastOrder: () => undefined },
    );

    expect(merged?.lastOrder).toBeNull();
  });
});
