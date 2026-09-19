"use client";

import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";

import {
  parseProductSearchParams,
  serializeProductSearchParams,
} from "@/features/products/utils/product-query";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 400;

type ProductSearchProps = {
  className?: string;
  lockedCategory?: string;
};

export function ProductSearch({ className, lockedCategory }: ProductSearchProps) {
  const t = useTranslations("catalogue");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputId = useId();
  const searchKey = searchParams.toString();

  const parsed = parseProductSearchParams(Object.fromEntries(searchParams.entries()));
  const urlQ = parsed.q ?? "";
  const [value, setValue] = useState(urlQ);
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);

  // Sync from URL only when the field isn't ahead of the committed query (user still typing).
  if (urlQ !== prevUrlQ) {
    setPrevUrlQ(urlQ);
    if (value.trim() === prevUrlQ || value.trim() === urlQ) {
      setValue(urlQ);
    }
  }

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const nextValue = value.trim();
      if (urlQ === nextValue) return;

      const current = parseProductSearchParams(Object.fromEntries(new URLSearchParams(searchKey).entries()));

      startTransition(() => {
        router.replace({
          pathname,
          query: serializeProductSearchParams({
            ...current,
            q: nextValue || undefined,
            page: 1,
            ...(lockedCategory ? { category: lockedCategory } : {}),
          }),
        });
      });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [value, urlQ, pathname, router, lockedCategory, searchKey, startTransition]);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <label htmlFor={inputId} className="sr-only">
        {t("productsPage.searchLabel")}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
      />
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t("productsPage.searchPlaceholder")}
        autoComplete="off"
        aria-busy={isPending || undefined}
        className={cn(
          "h-11 w-full rounded-lg border border-border bg-surface pe-10 ps-10 text-sm text-text shadow-sm",
          "placeholder:text-text-muted",
          "transition-[border-color,box-shadow] duration-200",
          "hover:border-border-strong",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      />
      {isPending ? (
        <Loader2
          aria-hidden
          className="absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary motion-reduce:animate-none"
        />
      ) : null}
      <span className="sr-only" aria-live="polite">
        {isPending ? t("productsPage.searching") : ""}
      </span>
    </div>
  );
}
