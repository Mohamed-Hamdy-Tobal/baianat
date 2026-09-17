import type { AuthSession } from "@/features/auth/types/auth";
import type { CartItem } from "@/features/cart/types/cart-item";
import { getCartItemSubtotal } from "@/features/cart/utils/cart-calculations";

import type { CheckoutFormValues } from "../schemas/checkout.schema";
import type { Order, OrderItem, ShippingInformation } from "../types/order";
import {
  calculateOrderSubtotal,
  calculateOrderTotal,
  calculateShipping,
} from "./order-calculations";
import { generateOrderId } from "./generate-order-id";

function toShippingInformation(values: CheckoutFormValues): ShippingInformation {
  const customer: ShippingInformation = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    address: values.address,
    city: values.city,
    country: values.country,
  };

  const postal = values.postalCode?.trim();
  if (postal) {
    customer.postalCode = postal;
  }

  return customer;
}

function toOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    title: item.title,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    subtotal: getCartItemSubtotal(item),
  }));
}

export type CreateOrderSnapshotInput = {
  values: CheckoutFormValues;
  items: CartItem[];
  session: AuthSession | null;
  createdAt?: Date;
};

/**
 * Builds a local demo Order from cart snapshots + form values.
 * Returns null when the cart is empty (caller should not place an order).
 */
export function createOrderSnapshot(input: CreateOrderSnapshotInput): Order | null {
  const { values, items, session } = input;
  if (items.length === 0) return null;

  const createdAt = input.createdAt ?? new Date();
  const seed = session
    ? `${session.user.id}:${session.user.username}`
    : `guest:${values.email}`;

  const order: Order = {
    id: generateOrderId(createdAt, seed),
    createdAt: createdAt.toISOString(),
    customer: toShippingInformation(values),
    items: toOrderItems(items),
    paymentMethod: values.paymentMethod,
    subtotal: calculateOrderSubtotal(items),
    shipping: calculateShipping(),
    total: calculateOrderTotal(items),
  };

  if (session) {
    order.userId = session.user.id;
    order.username = session.user.username;
  }

  return order;
}
