"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = Object.fromEntries(searchParams.entries());

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace(
        { pathname, query: Object.keys(query).length > 0 ? query : undefined },
        { locale: nextLocale },
      );
    });
  };

  return (
    <nav aria-label={t("language.label")} className="inline-flex items-center gap-1">
      {routing.locales.map((item) => {
        const isActive = item === locale;

        return (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={isActive ? "primary" : "ghost"}
            aria-current={isActive ? "true" : undefined}
            disabled={isPending}
            onClick={() => switchLocale(item)}
          >
            <span lang={item}>{t(`language.${item}`)}</span>
          </Button>
        );
      })}
    </nav>
  );
}
