export type PaymentMethod = "card" | "cash_on_delivery";

export type ShippingInformation = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
};

export type OrderItem = {
  productId: number;
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  createdAt: string;
  userId?: number;
  username?: string;
  customer: ShippingInformation;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
};

export type PlaceOrderError = "duplicate" | "unauthenticated" | "empty_cart" | "unknown";

export type PlaceOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: PlaceOrderError };
