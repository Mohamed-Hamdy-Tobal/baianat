import { beforeEach, describe, expect, it } from "vitest";

const memory = new Map<string, string>();

const localStorageMock: Storage = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
  removeItem: (key: string) => {
    memory.delete(key);
  },
  clear: () => {
    memory.clear();
  },
  key: (index: number) => Array.from(memory.keys())[index] ?? null,
  get length() {
    return memory.size;
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  configurable: true,
  writable: true,
});

Object.defineProperty(globalThis, "window", {
  value: globalThis,
  configurable: true,
  writable: true,
});

const { useCheckoutDetailsStore } = await import("./checkout-details.store");

const sample = {
  firstName: "Emily",
  lastName: "Johnson",
  email: "emily@example.com",
  phone: "+15550100",
  address: "1 Demo St",
  city: "Cairo",
  country: "Egypt",
  postalCode: "11511",
};

describe("useCheckoutDetailsStore", () => {
  beforeEach(() => {
    memory.clear();
    useCheckoutDetailsStore.setState({ details: null });
  });

  it("persists shipping details", () => {
    useCheckoutDetailsStore.getState().setCheckoutDetails(sample);
    expect(useCheckoutDetailsStore.getState().details).toEqual(sample);
  });

  it("clears shipping details", () => {
    useCheckoutDetailsStore.getState().setCheckoutDetails(sample);
    useCheckoutDetailsStore.getState().clearCheckoutDetails();
    expect(useCheckoutDetailsStore.getState().details).toBeNull();
  });

  it("recovers from malformed persisted state on merge", () => {
    const merge = useCheckoutDetailsStore.persist.getOptions().merge;
    expect(merge).toBeTypeOf("function");

    const merged = merge?.(
      { details: { firstName: 99 } },
      { details: null, setCheckoutDetails: () => {}, clearCheckoutDetails: () => {} },
    );

    expect(merged?.details).toBeNull();
  });
});
