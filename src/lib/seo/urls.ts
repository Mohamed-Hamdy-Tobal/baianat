import { env } from "@/lib/env";
import { routing, type Locale } from "@/i18n/routing";

/** Normalized site origin from NEXT_PUBLIC_SITE_URL (no trailing slash). */
export function getSiteOrigin(): string {
  return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
}

/**
 * Returns true when `path` is a safe relative site path.
 * Rejects protocol-relative, absolute, and scheme-based URLs.
 */
export function isSafeRelativePath(path: string): boolean {
  if (!path || typeof path !== "string") return false;
  if (path.includes("://")) return false;
  if (path.startsWith("//")) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return false;
  return path.startsWith("/");
}

/**
 * Absolute URL for an already locale-prefixed (or absolute) relative path.
 * Only composes origin + safe relative paths — never emits external hosts as site URLs.
 */
export function absoluteUrl(path: string): string {
  if (!isSafeRelativePath(path)) {
    throw new Error(`Unsafe site path: ${path}`);
  }

  const base = getSiteOrigin();
  const normalized = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${base}${normalized || ""}`;
}

/**
 * Locale-aware absolute URL.
 * pathname "/" → /{locale}
 * pathname "/products" → /{locale}/products
 */
export function localizedUrl(locale: Locale | string, pathname = "/"): string {
  const localeSegment = routing.locales.includes(locale as Locale)
    ? locale
    : routing.defaultLocale;

  let path = pathname.trim() || "/";
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }
  path = path.replace(/\/+$/, "") || "/";

  if (!isSafeRelativePath(path)) {
    throw new Error(`Unsafe localized path: ${pathname}`);
  }

  const localizedPath = path === "/" ? `/${localeSegment}` : `/${localeSegment}${path}`;
  return absoluteUrl(localizedPath);
}

export function productUrl(locale: Locale | string, slug: string): string {
  const safeSlug = slug.replace(/^\/+|\/+$/g, "");
  if (!safeSlug || safeSlug.includes("/") || safeSlug.includes("://")) {
    throw new Error(`Unsafe product slug: ${slug}`);
  }
  return localizedUrl(locale, `/products/${safeSlug}`);
}

export function categoryUrl(locale: Locale | string, slug: string): string {
  const safeSlug = slug.replace(/^\/+|\/+$/g, "");
  if (!safeSlug || safeSlug.includes("/") || safeSlug.includes("://")) {
    throw new Error(`Unsafe category slug: ${slug}`);
  }
  return localizedUrl(locale, `/categories/${safeSlug}`);
}

export function catalogueUrl(locale: Locale | string): string {
  return localizedUrl(locale, "/products");
}

export function categoriesIndexUrl(locale: Locale | string): string {
  return localizedUrl(locale, "/categories");
}

/** Absolute image URL only when the value is already a valid http(s) URL. */
export function absoluteImageUrl(src: string | null | undefined): string | undefined {
  if (!src || typeof src !== "string") return undefined;
  const trimmed = src.trim();
  if (!trimmed) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export type LanguageAlternates = {
  en: string;
  ar: string;
  "x-default": string;
};

/** Hreflang map for a public path (locale-agnostic pathname like `/products`). */
export function languageAlternates(pathname = "/"): LanguageAlternates {
  return {
    en: localizedUrl("en", pathname),
    ar: localizedUrl("ar", pathname),
    "x-default": localizedUrl(routing.defaultLocale, pathname),
  };
}
