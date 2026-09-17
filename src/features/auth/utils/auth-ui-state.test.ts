import { describe, expect, it } from "vitest";

import { getAuthUiState } from "./auth-ui-state";
import type { AuthSession } from "../types/auth";

const session: AuthSession = {
  token: "token",
  user: { id: 1, username: "emilys" },
};

describe("getAuthUiState", () => {
  it("returns unknown before hydration", () => {
    expect(getAuthUiState(false, null)).toBe("unknown");
    expect(getAuthUiState(false, session)).toBe("unknown");
  });

  it("derives guest and authenticated after hydration", () => {
    expect(getAuthUiState(true, null)).toBe("guest");
    expect(getAuthUiState(true, session)).toBe("authenticated");
  });
});
