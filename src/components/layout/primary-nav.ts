export const PRIMARY_NAV = [
  { href: "/", key: "home" },
  { href: "/categories", key: "categories" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export type PrimaryNavKey = (typeof PRIMARY_NAV)[number]["key"];

/** Locale-stripped pathname from next-intl `usePathname`. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
