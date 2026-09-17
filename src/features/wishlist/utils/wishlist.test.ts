import { describe, expect, it } from "vitest";

import type { WishlistItem } from "../types/wishlist-item";
import { parseWishlistItems } from "./parse-wishlist-items";
import { toCartSnapshotFromWishlist } from "./to-cart-snapshot";
import {
  addWishlistItem,
  clearWishlistItems,
  isInWishlist,
  removeWishlistItem,
  toggleWishlistItem,
} from "./wishlist-items";
import {
  addCartItem,
  removeCartItem as removeCartLine,
} from "@/features/cart/utils/cart-items";
import { toCartItemFromSnapshot } from "@/features/cart/utils/to-cart-item";
import type { CartItem } from "@/features/cart/types/cart-item";

const phone: WishlistItem = {
  productId: 1,
  slug: "iphone-1",
  title: "iPhone",
  price: 999,
  image: "https://cdn.dummyjson.com/phone.jpg",
  rating: { rate: 4.5, count: 10 },
};

const watch: WishlistItem = {
  productId: 2,
  slug: "watch-2",
  title: "Watch",
  price: 199,
  image: "https://cdn.dummyjson.com/watch.jpg",
};

describe("wishlist items", () => {
  it("adds an item", () => {
    expect(addWishlistItem([], phone)).toEqual([phone]);
  });

  it("ignores duplicate items", () => {
    expect(addWishlistItem([phone], { ...phone, title: "Duplicate" })).toEqual([phone]);
  });

  it("toggle adds an item when missing", () => {
    expect(toggleWishlistItem([], phone)).toEqual([phone]);
  });

  it("toggle removes an item when present", () => {
    expect(toggleWishlistItem([phone], phone)).toEqual([]);
  });

  it("removes an item", () => {
    expect(removeWishlistItem([phone, watch], 1)).toEqual([watch]);
  });

  it("clears the wishlist", () => {
    expect(clearWishlistItems()).toEqual([]);
  });

  it("reports isInWishlist correctly", () => {
    expect(isInWishlist([phone], 1)).toBe(true);
    expect(isInWishlist([phone], 2)).toBe(false);
  });
});

describe("parseWishlistItems", () => {
  it("recovers from malformed persisted state", () => {
    expect(parseWishlistItems(undefined)).toEqual([]);
    expect(parseWishlistItems([{ productId: 1 }])).toEqual([]);
    expect(parseWishlistItems([phone, phone, watch])).toEqual([phone, watch]);
  });
});

describe("wishlist and cart independence", () => {
  it("adds a wishlist item to the cart", () => {
    const snapshot = toCartItemFromSnapshot(toCartSnapshotFromWishlist(phone), 1);
    expect(snapshot).not.toBeNull();
    const cart = addCartItem([], snapshot as CartItem);
    expect(cart).toHaveLength(1);
    expect(cart[0]?.productId).toBe(1);
    expect(cart[0]?.quantity).toBe(1);
  });

  it("increments cart quantity when wishlist item is already in cart", () => {
    const existing: CartItem = {
      ...toCartSnapshotFromWishlist(phone),
      quantity: 2,
    };
    const snapshot = toCartItemFromSnapshot(toCartSnapshotFromWishlist(phone), 1);
    const cart = addCartItem([existing], snapshot as CartItem);
    expect(cart).toHaveLength(1);
    expect(cart[0]?.quantity).toBe(3);
  });

  it("removing a wishlist item does not affect the cart", () => {
    const cart: CartItem[] = [
      {
        ...toCartSnapshotFromWishlist(phone),
        quantity: 1,
      },
    ];
    const wishlist = removeWishlistItem([phone, watch], 1);
    expect(wishlist).toEqual([watch]);
    expect(cart).toHaveLength(1);
  });

  it("keeps cart and wishlist independent", () => {
    let cart: CartItem[] = [
      {
        ...toCartSnapshotFromWishlist(phone),
        quantity: 1,
      },
    ];
    let wishlist = [phone, watch];

    cart = removeCartLine(cart, 1);
    expect(cart).toEqual([]);
    expect(wishlist).toEqual([phone, watch]);

    wishlist = removeWishlistItem(wishlist, 2);
    expect(wishlist).toEqual([phone]);
    expect(cart).toEqual([]);
  });
});
