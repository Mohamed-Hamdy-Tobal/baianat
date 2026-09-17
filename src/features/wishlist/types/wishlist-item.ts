export type WishlistItem = {
  productId: number;
  slug: string;
  title: string;
  price: number;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

/** Minimal product shape needed to build a wishlist snapshot. */
export type WishlistProductInput = {
  id: number;
  slug: string;
  title: string;
  price: number;
  discountPercentage: number;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};
