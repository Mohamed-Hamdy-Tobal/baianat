import { routing, type Locale } from "@/i18n/routing";

const AUTH_PATH_SEGMENTS = new Set(["login", "register"]);

function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

/**
 * Validate an internal redirect path for post-login navigation.
 * Rejects external URLs, protocol handlers, and auth pages (loop prevention).
 * Returns a locale-prefixed absolute path (e.g. /en/checkout).
 */
export function getSafeRedirect(redirect: string | null | undefined, locale: string): string {
  const fallback = `/${locale}`;

  if (!redirect || typeof redirect !== "string") {
    return fallback;
  }

  const trimmed = redirect.trim();

  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("\\")) return fallback;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return fallback;
  if (trimmed.toLowerCase().startsWith("javascript:")) return fallback;

  let pathname: string;
  let search = "";

  try {
    const url = new URL(trimmed, "http://baianat.local");
    pathname = url.pathname;
    search = url.search;
  } catch {
    return fallback;
  }

  if (!pathname.startsWith("/")) return fallback;

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  let localePrefixedPath: string;

  if (first && isLocale(first)) {
    localePrefixedPath = pathname;
  } else {
    localePrefixedPath = `/${locale}${pathname === "/" ? "" : pathname}`;
  }

  const pathSegments = localePrefixedPath.split("/").filter(Boolean);
  const pageSegment = pathSegments[1];

  if (pageSegment && AUTH_PATH_SEGMENTS.has(pageSegment)) {
    return fallback;
  }

  return `${localePrefixedPath}${search}`;
}

/**
 * Convert a locale-prefixed path into a next-intl href (locale-stripped).
 * e.g. /en/checkout → /checkout, /ar → /
 */
export function toLocaleHref(path: string, locale: string): string {
  const prefix = `/${locale}`;

  if (path === prefix || path === `${prefix}/`) {
    return "/";
  }

  if (path.startsWith(`${prefix}/`)) {
    return path.slice(prefix.length) || "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Build a login URL with a safe redirect query param.
 */
export function buildLoginRedirectHref(intendedPath: string, locale: string): string {
  const safe = getSafeRedirect(intendedPath, locale);
  const params = new URLSearchParams({ redirect: safe });
  return `/login?${params.toString()}`;
}
