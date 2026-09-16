import { describe, expect, it } from "vitest";

import { localeDirection, routing } from "./routing";

describe("routing", () => {
  it("supports en and ar with English as the default", () => {
    expect(routing.locales).toEqual(["en", "ar"]);
    expect(routing.defaultLocale).toBe("en");
    expect(routing.localePrefix).toBe("always");
  });

  it("defines a document direction for every configured locale", () => {
    for (const locale of routing.locales) {
      expect(localeDirection[locale]).toMatch(/^(ltr|rtl)$/);
    }

    expect(localeDirection.en).toBe("ltr");
    expect(localeDirection.ar).toBe("rtl");
  });
});
