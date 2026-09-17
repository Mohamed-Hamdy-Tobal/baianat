import { z } from "zod";

import type { Order } from "../types/order";

const shippingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1).optional(),
});

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  image: z.string().min(1),
  price: z.number().finite().nonnegative(),
  quantity: z.number().int().positive(),
  subtotal: z.number().finite().nonnegative(),
});

const orderSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  userId: z.number().int().positive().optional(),
  username: z.string().min(1).optional(),
  customer: shippingSchema,
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(["card", "cash_on_delivery"]),
  subtotal: z.number().finite().nonnegative(),
  shipping: z.number().finite().nonnegative(),
  total: z.number().finite().nonnegative(),
});

/**
 * Recover a valid Order from unknown persisted state.
 * Returns null for malformed payloads.
 */
export function parseLastOrder(value: unknown): Order | null {
  const parsed = orderSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
