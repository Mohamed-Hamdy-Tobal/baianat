import { describe, expect, it } from "vitest";

import {
  authLoginDtoSchema,
  loginFormSchema,
  registerFormSchema,
} from "./auth.schema";

describe("loginFormSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginFormSchema.safeParse({
      username: "emilys",
      password: "emilyspass",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty username", () => {
    const result = loginFormSchema.safeParse({
      username: "   ",
      password: "emilyspass",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginFormSchema.safeParse({
      username: "emilys",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerFormSchema", () => {
  const valid = {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@example.com",
    username: "ada",
    password: "secret",
    confirmPassword: "secret",
  };

  it("validates matching fields", () => {
    const result = registerFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects password mismatch", () => {
    const result = registerFormSchema.safeParse({
      ...valid,
      confirmPassword: "other",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes("confirmPassword"))).toBe(true);
    }
  });
});

describe("authLoginDtoSchema", () => {
  it("accepts a documented DummyJSON login payload", () => {
    const result = authLoginDtoSchema.safeParse({
      id: 1,
      username: "emilys",
      email: "emily.johnson@x.dummyjson.com",
      firstName: "Emily",
      lastName: "Johnson",
      gender: "female",
      image: "https://dummyjson.com/icon/emilys/128",
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test",
      refreshToken: "refresh-token-value",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.accessToken).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test");
      expect("refreshToken" in result.data).toBe(false);
      expect("gender" in result.data).toBe(false);
    }
  });

  it("rejects missing accessToken", () => {
    const result = authLoginDtoSchema.safeParse({
      id: 1,
      username: "emilys",
    });
    expect(result.success).toBe(false);
  });
});
