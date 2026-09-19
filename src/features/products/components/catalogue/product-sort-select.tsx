"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

import {
  parseProductSearchParams,
  PRODUCT_SORT_OPTIONS,
  serializeProductSearchParams,
  type ProductSortOption,
} from "@/features/products/utils/product-query";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SORT_LABEL: Record<ProductSortOption, string> = {
  default: "default",
  newest: "newest",
  "price-asc": "priceAsc",
  "price-desc": "priceDesc",
  "rating-desc": "ratingDesc",
  "title-asc": "titleAsc",
  "title-desc": "titleDesc",
};

type ProductSortSelectProps = {
  className?: string;
  lockedCategory?: string;
};

export function ProductSortSelect({ className, lockedCategory }: ProductSortSelectProps) {
  const t = useTranslations("catalogue");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const query = {
    ...parseProductSearchParams(Object.fromEntries(searchParams.entries())),
    ...(lockedCategory ? { category: lockedCategory } : {}),
  };

  const onChange = (value: string) => {
    const sort = PRODUCT_SORT_OPTIONS.includes(value as ProductSortOption)
      ? (value as ProductSortOption)
      : "default";

    startTransition(() => {
      router.replace({
        pathname,
        query: serializeProductSearchParams({
          ...query,
          sort,
          page: 1,
          ...(lockedCategory ? { category: lockedCategory } : {}),
        }),
      });
    });
  };

  return (
    <div className={cn("min-w-0", className)}>
      <select
        value={query.sort}
        disabled={isPending}
        aria-label={t("sort.label")}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 w-full rounded-md border border-border-strong bg-surface pe-8 ps-3 text-sm font-medium text-text",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50",
        )}
      >
        {PRODUCT_SORT_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {t(`sort.${SORT_LABEL[value]}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
