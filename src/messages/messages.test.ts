import { describe, expect, it } from "vitest";

import arCatalogue from "./ar/catalogue.json";
import arCart from "./ar/cart.json";
import arCategories from "./ar/categories.json";
import arCommon from "./ar/common.json";
import arErrors from "./ar/errors.json";
import arHome from "./ar/home.json";
import arNavigation from "./ar/navigation.json";
import arPages from "./ar/pages.json";
import arWishlist from "./ar/wishlist.json";
import enCatalogue from "./en/catalogue.json";
import enCart from "./en/cart.json";
import enCategories from "./en/categories.json";
import enCommon from "./en/common.json";
import enErrors from "./en/errors.json";
import enHome from "./en/home.json";
import enNavigation from "./en/navigation.json";
import enPages from "./en/pages.json";
import enWishlist from "./en/wishlist.json";

type MessageTree = string | { [key: string]: MessageTree };

function collectKeys(tree: MessageTree, prefix = ""): string[] {
  if (typeof tree === "string") {
    return prefix ? [prefix] : [];
  }

  return Object.entries(tree).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return collectKeys(value, next);
  });
}

const namespaces = {
  common: { en: enCommon, ar: arCommon },
  navigation: { en: enNavigation, ar: arNavigation },
  home: { en: enHome, ar: arHome },
  errors: { en: enErrors, ar: arErrors },
  pages: { en: enPages, ar: arPages },
  categories: { en: enCategories, ar: arCategories },
  catalogue: { en: enCatalogue, ar: arCatalogue },
  cart: { en: enCart, ar: arCart },
  wishlist: { en: enWishlist, ar: arWishlist },
} as const;

describe("messages", () => {
  for (const [namespace, { en, ar }] of Object.entries(namespaces)) {
    it(`keeps identical key trees for ${namespace}`, () => {
      const enKeys = collectKeys(en).sort();
      const arKeys = collectKeys(ar).sort();

      expect(arKeys).toEqual(enKeys);
    });
  }
});
