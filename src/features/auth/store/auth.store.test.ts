import { beforeEach, describe, expect, it } from "vitest";

import type { AuthSession } from "../types/auth";

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
const { useWishlistStore } = await import("@/features/wishlist/store/wishlist.store");
const { useAuthStore } = await import("../store/auth.store");

const session: AuthSession = {
  token: "access-token",
  user: { id: 1, username: "emilys", firstName: "Emily" },
};

describe("useAuthStore", () => {
  beforeEach(() => {
    memory.clear();
    useAuthStore.setState({ session: null });
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it("becomes authenticated after login", () => {
    useAuthStore.getState().login(session);

    expect(useAuthStore.getState().session).toEqual(session);
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });

  it("clears the session on logout", () => {
    useAuthStore.getState().login(session);
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it("does not clear cart on logout", () => {
    useCartStore.getState().addItem(
      {
        id: 1,
        slug: "phone-1",
        title: "Phone",
        price: 100,
        discountPercentage: 0,
        image: "https://cdn.dummyjson.com/phone.jpg",
      },
      1,
    );
    useAuthStore.getState().login(session);
    useAuthStore.getState().logout();

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.productId).toBe(1);
  });

  it("does not clear wishlist on logout", () => {
    useWishlistStore.getState().addItem({
      id: 2,
      slug: "watch-2",
      title: "Watch",
      price: 50,
      discountPercentage: 0,
      image: "https://cdn.dummyjson.com/watch.jpg",
    });
    useAuthStore.getState().login(session);
    useAuthStore.getState().logout();

    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().items[0]?.productId).toBe(2);
  });
});
