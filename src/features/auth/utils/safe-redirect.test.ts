import { describe, expect, it } from "vitest";

import { getSafeRedirect, toLocaleHref, buildLoginRedirectHref } from "./safe-redirect";

describe("getSafeRedirect", () => {
  it("accepts a valid internal locale path", () => {
    expect(getSafeRedirect("/en/checkout", "en")).toBe("/en/checkout");
  });

  it("uses a safe default when redirect is missing", () => {
    expect(getSafeRedirect(null, "en")).toBe("/en");
    expect(getSafeRedirect(undefined, "ar")).toBe("/ar");
    expect(getSafeRedirect("", "en")).toBe("/en");
  });

  it("rejects external redirects", () => {
    expect(getSafeRedirect("https://evil.example.com", "en")).toBe("/en");
    expect(getSafeRedirect("//evil.example.com", "en")).toBe("/en");
  });

  it("rejects javascript redirects", () => {
    expect(getSafeRedirect("javascript:alert(1)", "en")).toBe("/en");
  });

  it("preserves locale checkout redirects", () => {
    expect(getSafeRedirect("/en/checkout", "en")).toBe("/en/checkout");
    expect(getSafeRedirect("/ar/checkout", "ar")).toBe("/ar/checkout");
  });

  it("prefixes locale-stripped paths with the current locale", () => {
    expect(getSafeRedirect("/checkout", "en")).toBe("/en/checkout");
    expect(getSafeRedirect("/products", "ar")).toBe("/ar/products");
  });

  it("preserves query strings on internal paths", () => {
    expect(getSafeRedirect("/en/products?q=phone", "en")).toBe("/en/products?q=phone");
  });

  it("rejects login and register destinations to avoid loops", () => {
    expect(getSafeRedirect("/en/login", "en")).toBe("/en");
    expect(getSafeRedirect("/ar/register", "ar")).toBe("/ar");
  });
});

describe("toLocaleHref", () => {
  it("strips the locale prefix for next-intl navigation", () => {
    expect(toLocaleHref("/en/checkout", "en")).toBe("/checkout");
    expect(toLocaleHref("/en", "en")).toBe("/");
    expect(toLocaleHref("/ar/cart", "ar")).toBe("/cart");
  });
});

describe("buildLoginRedirectHref", () => {
  it("builds a login path with a validated redirect query", () => {
    expect(buildLoginRedirectHref("/en/checkout", "en")).toBe(
      "/login?redirect=%2Fen%2Fcheckout",
    );
  });
});
