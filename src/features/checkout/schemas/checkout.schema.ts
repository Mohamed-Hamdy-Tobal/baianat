import { z } from "zod";

const requiredString = z.string().trim().min(1, "required");

export const checkoutFormSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
  email: requiredString.email("email"),
  phone: requiredString,
  address: requiredString,
  city: requiredString,
  country: requiredString,
  postalCode: z.string().trim().optional(),
  paymentMethod: z.enum(["card", "cash_on_delivery"], {
    error: "required",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
