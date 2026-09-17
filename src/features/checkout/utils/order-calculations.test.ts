import { describe, expect, it } from "vitest";

import type { CartItem } from "@/features/cart/types/cart-item";

import {
  calculateOrderSubtotal,
  calculateOrderTotal,
  calculateShipping,
} from "./order-calculations";

const phone: CartItem = {
  productId: 1,
  slug: "iphone-1",
  title: "iPhone",
  price: 100,
  image: "https://cdn.dummyjson.com/phone.jpg",
  quantity: 2,
};

const watch: CartItem = {
  productId: 2,
  slug: "watch-2",
  title: "Watch",
  price: 50.55,
  image: "https://cdn.dummyjson.com/watch.jpg",
  quantity: 1,
};

describe("order calculations", () => {
  it("calculates subtotal from cart items", () => {
    expect(calculateOrderSubtotal([phone, watch])).toBe(250.55);
  });

  it("uses free shipping (zero)", () => {
    expect(calculateShipping()).toBe(0);
  });

  it("sets total equal to subtotal", () => {
    const items = [phone, watch];
    expect(calculateOrderTotal(items)).toBe(calculateOrderSubtotal(items));
  });
});
