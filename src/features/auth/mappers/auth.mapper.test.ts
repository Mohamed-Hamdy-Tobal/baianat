import { describe, expect, it } from "vitest";

import { toAuthSession } from "./auth.mapper";

describe("toAuthSession", () => {
  it("maps DTO accessToken onto domain session token", () => {
    const session = toAuthSession({
      id: 1,
      username: "emilys",
      email: "emily.johnson@x.dummyjson.com",
      firstName: "Emily",
      lastName: "Johnson",
      image: "https://dummyjson.com/icon/emilys/128",
      accessToken: "access-token-value",
    });

    expect(session).toEqual({
      token: "access-token-value",
      user: {
        id: 1,
        username: "emilys",
        email: "emily.johnson@x.dummyjson.com",
        firstName: "Emily",
        lastName: "Johnson",
        image: "https://dummyjson.com/icon/emilys/128",
      },
    });
    expect("refreshToken" in session).toBe(false);
  });

  it("omits optional profile fields when absent", () => {
    const session = toAuthSession({
      id: 2,
      username: "user2",
      accessToken: "token",
    });

    expect(session).toEqual({
      token: "token",
      user: {
        id: 2,
        username: "user2",
      },
    });
  });
});
