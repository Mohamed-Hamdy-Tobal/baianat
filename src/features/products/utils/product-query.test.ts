import { describe, expect, it, vi, afterEach } from "vitest";

import {
  PAGE_SIZE,
  parseProductSearchParams,
  serializeProductSearchParams,
  sortToApi,
  totalPages,
  updatedPresetToIso,
} from "./product-query";

describe("parseProductSearchParams", () => {
  it("applies defaults", () => {
    expect(parseProductSearchParams({})).toEqual({
      page: 1,
      sort: "default",
      q: undefined,
      category: undefined,
      updated: undefined,
    });
  });

  it("parses known filters and ignores invalid sort", () => {
    expect(
      parseProductSearchParams({
        page: "2",
        q: " mascara ",
        category: "beauty",
        sort: "price-asc",
        updated: "7d",
      }),
    ).toEqual({
      page: 2,
      q: "mascara",
      category: "beauty",
      sort: "price-asc",
      updated: "7d",
    });

    expect(parseProductSearchParams({ sort: "nope", page: "0" })).toMatchObject({
      sort: "default",
      page: 1,
    });
  });
});

describe("serializeProductSearchParams", () => {
  it("omits defaults", () => {
    expect(
      serializeProductSearchParams({
        page: 1,
        sort: "default",
      }),
    ).toEqual({});
  });

  it("round-trips non-default values", () => {
    const query = parseProductSearchParams({
      page: "3",
      q: "phone",
      category: "smartphones",
      sort: "rating-desc",
      updated: "30d",
    });

    expect(serializeProductSearchParams(query)).toEqual({
      page: "3",
      q: "phone",
      category: "smartphones",
      sort: "rating-desc",
      updated: "30d",
    });
  });
});

describe("totalPages", () => {
  it("uses PAGE_SIZE math", () => {
    expect(PAGE_SIZE).toBe(20);
    expect(totalPages(0)).toBe(0);
    expect(totalPages(20)).toBe(1);
    expect(totalPages(21)).toBe(2);
  });
});

describe("sortToApi", () => {
  it("maps sort options to DummyJSON params", () => {
    expect(sortToApi("default")).toEqual({});
    expect(sortToApi("price-asc")).toEqual({ sortBy: "price", order: "asc" });
    expect(sortToApi("newest")).toEqual({ sortBy: "id", order: "desc" });
  });
});

describe("updatedPresetToIso", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("computes modifiedAfter from presets", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-17T12:00:00.000Z"));

    expect(updatedPresetToIso("7d")).toBe("2026-09-10T12:00:00.000Z");
    expect(updatedPresetToIso("30d")).toBe("2026-08-18T12:00:00.000Z");
  });
});
