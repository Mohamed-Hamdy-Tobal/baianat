import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locale as getLocaleParam } from "next/root-params";

import { routing, type Locale } from "./routing";

const namespaces = [
  "common",
  "navigation",
  "home",
  "errors",
  "pages",
  "categories",
  "catalogue",
  "cart",
  "wishlist",
  "auth",
] as const;

async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    namespaces.map(async (namespace) => {
      const messagesModule = await import(`../messages/${locale}/${namespace}.json`);
      return [namespace, messagesModule.default] as const;
    }),
  );

  return Object.fromEntries(entries);
}

export default getRequestConfig(async () => {
  const candidate = await getLocaleParam();

  if (!hasLocale(routing.locales, candidate)) {
    notFound();
  }

  return {
    locale: candidate,
    messages: await loadMessages(candidate),
  };
});
