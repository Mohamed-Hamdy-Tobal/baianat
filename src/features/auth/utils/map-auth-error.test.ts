import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/errors";

import { mapAuthError } from "./map-auth-error";

describe("mapAuthError", () => {
  it("maps 400/401 http errors to invalid_credentials", () => {
    expect(mapAuthError(new ApiError("bad", { code: "http", status: 400 }))).toBe(
      "invalid_credentials",
    );
    expect(mapAuthError(new ApiError("unauth", { code: "http", status: 401 }))).toBe(
      "invalid_credentials",
    );
  });

  it("maps network and timeout to network", () => {
    expect(mapAuthError(new ApiError("net", { code: "network" }))).toBe("network");
    expect(mapAuthError(new ApiError("to", { code: "timeout" }))).toBe("network");
  });

  it("maps everything else to unknown", () => {
    expect(mapAuthError(new ApiError("shape", { code: "invalid_shape" }))).toBe("unknown");
    expect(mapAuthError(new ApiError("http", { code: "http", status: 500 }))).toBe("unknown");
    expect(mapAuthError(new Error("boom"))).toBe("unknown");
  });
});
