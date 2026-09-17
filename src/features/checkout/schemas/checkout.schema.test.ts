import { describe, expect, it } from "vitest";

import { checkoutFormSchema } from "./checkout.schema";

const valid = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  phone: "+1 555 0100",
  address: "42 Analytical Engine Rd",
  city: "London",
  country: "United Kingdom",
  postalCode: "SW1A 1AA",
  paymentMethod: "card" as const,
};

describe("checkoutFormSchema", () => {
  it("accepts valid checkout data", () => {
    const result = checkoutFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = checkoutFormSchema.safeParse({
      ...valid,
      firstName: "",
      city: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = checkoutFormSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message === "email")).toBe(true);
    }
  });

  it("rejects whitespace-only required values", () => {
    const result = checkoutFormSchema.safeParse({
      ...valid,
      firstName: "   ",
      phone: "  ",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional postal code to be omitted or empty", () => {
    expect(
      checkoutFormSchema.safeParse({
        ...valid,
        postalCode: "",
      }).success,
    ).toBe(true);

    const withoutPostal = { ...valid };
    delete (withoutPostal as { postalCode?: string }).postalCode;
    expect(checkoutFormSchema.safeParse(withoutPostal).success).toBe(true);
  });

  it("validates payment method", () => {
    expect(
      checkoutFormSchema.safeParse({
        ...valid,
        paymentMethod: "cash_on_delivery",
      }).success,
    ).toBe(true);

    expect(
      checkoutFormSchema.safeParse({
        ...valid,
        paymentMethod: "paypal",
      }).success,
    ).toBe(false);
  });
});
