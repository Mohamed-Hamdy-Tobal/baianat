import { describe, expect, it } from "vitest";

import type { CartItem } from "../types/cart-item";
import {
  getCartItemCount,
  getCartItemSubtotal,
  getCartSubtotal,
} from "./cart-calculations";
import {
  addCartItem,
  clearCartItems,
  decrementCartItem,
  incrementCartItem,
  removeCartItem,
  updateCartQuantity,
} from "./cart-items";
import { parseCartItems } from "./parse-cart-items";
import { MAX_QUANTITY, normalizeQuantity } from "./quantity";
import { toCartItem } from "./to-cart-item";

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
  price: 50,
  image: "https://cdn.dummyjson.com/watch.jpg",
  quantity: 1,
};

describe("cart items", () => {
  it("adds a new item", () => {
    expect(addCartItem([], phone)).toEqual([phone]);
  });

  it("increases quantity when adding an existing product", () => {
    const result = addCartItem([phone], { ...phone, quantity: 3 });
    expect(result).toHaveLength(1);
    expect(result[0]?.quantity).toBe(5);
  });

  it("does not create duplicate rows for the same product", () => {
    const result = addCartItem([phone], { ...phone, quantity: 1 });
    expect(result).toHaveLength(1);
  });

  it("increments quantity", () => {
    expect(incrementCartItem([phone], 1)[0]?.quantity).toBe(3);
  });

  it("decrements quantity", () => {
    expect(decrementCartItem([phone], 1)[0]?.quantity).toBe(1);
  });

  it("does not decrease quantity below 1", () => {
    expect(decrementCartItem([{ ...phone, quantity: 1 }], 1)[0]?.quantity).toBe(1);
  });

  it("does not exceed max quantity of 99", () => {
    const nearMax = addCartItem([{ ...phone, quantity: 98 }], { ...phone, quantity: 5 });
    expect(nearMax[0]?.quantity).toBe(MAX_QUANTITY);

    const atMax = incrementCartItem([{ ...phone, quantity: 99 }], 1);
    expect(atMax[0]?.quantity).toBe(99);
  });

  it("handles invalid quantities safely", () => {
    expect(normalizeQuantity(NaN)).toBeNull();
    expect(normalizeQuantity(Infinity)).toBeNull();
    expect(normalizeQuantity(-3)).toBeNull();
    expect(addCartItem([], { ...phone, quantity: NaN })).toEqual([]);
    expect(updateCartQuantity([phone], 1, NaN)).toEqual([phone]);
    expect(updateCartQuantity([phone], 1, 0)).toEqual([]);
  });

  it("removes an item", () => {
    expect(removeCartItem([phone, watch], 1)).toEqual([watch]);
  });

  it("clears the cart", () => {
    expect(clearCartItems()).toEqual([]);
  });

  it("is a no-op when removing or updating a missing product", () => {
    expect(removeCartItem([phone], 99)).toEqual([phone]);
    expect(updateCartQuantity([phone], 99, 2)).toEqual([phone]);
    expect(incrementCartItem([phone], 99)).toEqual([phone]);
  });
});

describe("cart calculations", () => {
  it("calculates item subtotal", () => {
    expect(getCartItemSubtotal(phone)).toBe(200);
  });

  it("calculates cart subtotal", () => {
    expect(getCartSubtotal([phone, watch])).toBe(250);
  });

  it("calculates total item count", () => {
    expect(getCartItemCount([phone, watch])).toBe(3);
  });
});

describe("parseCartItems", () => {
  it("recovers from malformed persisted state", () => {
    expect(parseCartItems(null)).toEqual([]);
    expect(parseCartItems("bad")).toEqual([]);
    expect(parseCartItems([{ productId: "x" }])).toEqual([]);
    expect(parseCartItems([phone, { ...phone, quantity: 0 }, watch])).toEqual([phone, watch]);
  });
});

describe("toCartItem", () => {
  it("snapshots discounted selling price", () => {
    const item = toCartItem(
      {
        id: 10,
        slug: "sale-10",
        title: "Sale",
        price: 100,
        discountPercentage: 10,
        image: "https://cdn.dummyjson.com/sale.jpg",
      },
      2,
    );
    expect(item?.price).toBe(90);
    expect(item?.quantity).toBe(2);
  });
});
