import { z } from "zod";

export type CheckoutShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

const checkoutShippingDetailsSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string().optional().default(""),
});

/**
 * Recover saved checkout shipping details from unknown persisted state.
 * Returns null for malformed payloads.
 */
export function parseCheckoutDetails(value: unknown): CheckoutShippingDetails | null {
  const parsed = checkoutShippingDetailsSchema.safeParse(value);
  if (!parsed.success) return null;

  return {
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    address: parsed.data.address,
    city: parsed.data.city,
    country: parsed.data.country,
    postalCode: parsed.data.postalCode ?? "",
  };
}
