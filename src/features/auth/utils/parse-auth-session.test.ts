import { describe, expect, it } from "vitest";

import { parseAuthSession } from "./parse-auth-session";

describe("parseAuthSession", () => {
  it("accepts a well-formed session", () => {
    const session = parseAuthSession({
      token: "access-token",
      user: { id: 1, username: "emilys", firstName: "Emily" },
    });

    expect(session).toEqual({
      token: "access-token",
      user: { id: 1, username: "emilys", firstName: "Emily" },
    });
  });

  it("recovers safely from malformed persisted state", () => {
    expect(parseAuthSession(null)).toBeNull();
    expect(parseAuthSession(undefined)).toBeNull();
    expect(parseAuthSession({})).toBeNull();
    expect(parseAuthSession({ token: "", user: { id: 1, username: "x" } })).toBeNull();
    expect(parseAuthSession({ token: "t", user: { id: "1", username: "x" } })).toBeNull();
    expect(parseAuthSession({ token: "t" })).toBeNull();
  });
});
