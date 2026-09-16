"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { isNavActive, PRIMARY_NAV } from "./primary-nav";

export function MobileNav() {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label={tCommon("a11y.openMenu")}>
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>{tCommon("a11y.mainNav")}</SheetTitle>
        </SheetHeader>
        <nav aria-label={tCommon("a11y.mainNav")} className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = isNavActive(pathname, item.href);

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-3 text-base font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                    "motion-reduce:transition-none",
                    active ? "bg-primary-soft text-primary" : "text-text-secondary hover:bg-background hover:text-text",
                  )}
                >
                  {t(item.key)}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-border pt-4">
          <Suspense fallback={null}>
            <LanguageSwitcher />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}
