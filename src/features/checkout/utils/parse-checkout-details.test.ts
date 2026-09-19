import { describe, expect, it } from "vitest";

import { parseCheckoutDetails } from "./parse-checkout-details";

describe("parseCheckoutDetails", () => {
  it("accepts a well-formed shipping snapshot", () => {
    const details = parseCheckoutDetails({
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily@example.com",
      phone: "+15550100",
      address: "1 Demo St",
      city: "Cairo",
      country: "Egypt",
      postalCode: "11511",
    });

    expect(details).toEqual({
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily@example.com",
      phone: "+15550100",
      address: "1 Demo St",
      city: "Cairo",
      country: "Egypt",
      postalCode: "11511",
    });
  });

  it("defaults missing postalCode to empty string", () => {
    const details = parseCheckoutDetails({
      firstName: "Emily",
      lastName: "Johnson",
      email: "emily@example.com",
      phone: "+15550100",
      address: "1 Demo St",
      city: "Cairo",
      country: "Egypt",
    });

    expect(details?.postalCode).toBe("");
  });

  it("returns null for malformed payloads", () => {
    expect(parseCheckoutDetails(null)).toBeNull();
    expect(parseCheckoutDetails({})).toBeNull();
    expect(parseCheckoutDetails({ firstName: 1 })).toBeNull();
  });
});
