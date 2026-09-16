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
    <nav aria-label={tCommon("a11y.mainNav")} className={cn("hidden items-center gap-1 md:flex", className)}>
      {PRIMARY_NAV.map((item) => {
        const active = isNavActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              "motion-reduce:transition-none",
              active
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text",
            )}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
