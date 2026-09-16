"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { PRODUCT_SORT_VALUES, type ProductSort } from "@/features/products/utils/sort-products";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SORT_LABEL_KEYS: Record<ProductSort, "featured" | "priceAsc" | "priceDesc" | "rating"> = {
  featured: "featured",
  "price-asc": "priceAsc",
  "price-desc": "priceDesc",
  rating: "rating",
};

type ProductSortSelectProps = {
  className?: string;
};

export function ProductSortSelect({ className }: ProductSortSelectProps) {
  const t = useTranslations("catalogue");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = (PRODUCT_SORT_VALUES.includes(searchParams.get("sort") as ProductSort)
    ? searchParams.get("sort")
    : "featured") as ProductSort;

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const query = Object.fromEntries(params.entries());

    startTransition(() => {
      router.replace({ pathname, query: Object.keys(query).length > 0 ? query : undefined });
    });
  };

  return (
    <label className={cn("inline-flex items-center gap-2 text-sm text-text-secondary", className)}>
      <span className="whitespace-nowrap">{t("sort.label")}</span>
      <select
        value={current}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-10 rounded-md border border-border-strong bg-surface px-3 text-sm text-text",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50",
        )}
      >
        {PRODUCT_SORT_VALUES.map((value) => (
          <option key={value} value={value}>
            {t(`sort.${SORT_LABEL_KEYS[value]}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
