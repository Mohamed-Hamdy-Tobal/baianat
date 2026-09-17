"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { isNavActive, PRIMARY_NAV } from "./primary-nav";

type DesktopNavProps = {
  className?: string;
};

export function DesktopNav({ className }: DesktopNavProps) {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  return (
    <nav aria-label={tCommon("a11y.mainNav")} className={cn("hidden items-center gap-0.5 md:flex", className)}>
      {PRIMARY_NAV.map((item) => {
        const active = isNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative px-3 py-2 text-sm font-medium transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              "motion-reduce:transition-none",
              active ? "text-primary" : "text-text-secondary hover:text-text",
            )}
          >
            {t(item.key)}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-primary transition-transform duration-300 ease-out",
                "motion-reduce:transition-none",
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-border-strong",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
