export type CartItem = {
  productId: number;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};

/** Minimal product shape needed to build a cart snapshot. */
export type CartProductInput = {
  id: number;
  slug: string;
  title: string;
  price: number;
  discountPercentage: number;
  image: string;
};
