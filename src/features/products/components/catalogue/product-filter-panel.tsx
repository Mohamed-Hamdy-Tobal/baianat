"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition, type ReactNode } from "react";

import type { Category } from "@/features/products/types/category";
import {
  parseProductSearchParams,
  serializeProductSearchParams,
  UPDATED_PRESETS,
  type ProductQuery,
  type UpdatedPreset,
} from "@/features/products/utils/product-query";
import { resolveCategoryLabel } from "@/features/products/utils/resolve-category-label";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProductFilterPanelProps = {
  categories: Category[];
  className?: string;
  onApplied?: () => void;
  lockedCategory?: string;
};

export function ProductFilterPanel({
  categories,
  className,
  onApplied,
  lockedCategory,
}: ProductFilterPanelProps) {
  const t = useTranslations("catalogue");
  const tCategories = useTranslations("categories");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const query = {
    ...parseProductSearchParams(Object.fromEntries(searchParams.entries())),
    ...(lockedCategory ? { category: lockedCategory } : {}),
  };

  const update = (patch: Partial<ProductQuery>) => {
    startTransition(() => {
      router.replace({
        pathname,
        query: serializeProductSearchParams({
          ...query,
          ...patch,
          page: 1,
          ...(lockedCategory ? { category: lockedCategory } : {}),
        }),
      });
      onApplied?.();
    });
  };

  const clear = () => {
    startTransition(() => {
      router.replace({
        pathname,
        query: serializeProductSearchParams({
          page: 1,
          sort: query.sort,
          q: query.q,
          ...(lockedCategory ? { category: lockedCategory } : {}),
        }),
      });
      onApplied?.();
    });
  };

  const canClear = lockedCategory ? Boolean(query.updated) : Boolean(query.category || query.updated);

  return (
    <div className={cn("flex flex-col gap-5", className)} aria-busy={isPending || undefined}>
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="text-base font-semibold tracking-tight text-text">{t("productsPage.filters")}</h2>
        <button
          type="button"
          onClick={clear}
          disabled={!canClear}
          className={cn(
            "text-xs font-medium text-primary transition-opacity",
            "hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {t("productsPage.clearFilters")}
        </button>
      </div>

      {!lockedCategory ? (
        <FilterSection title={t("productsPage.categoryFilter")}>
          <div
            role="radiogroup"
            aria-label={t("productsPage.categoryFilter")}
            className="flex max-h-72 flex-col gap-1 overflow-y-auto pe-1"
          >
            <FilterOption
              selected={!query.category}
              label={t("productsPage.allCategories")}
              onSelect={() => update({ category: undefined })}
            />
            {categories.map((category) => (
              <FilterOption
                key={category.slug}
                selected={query.category === category.apiValue}
                label={resolveCategoryLabel(tCategories, category)}
                onSelect={() => update({ category: category.apiValue })}
              />
            ))}
          </div>
        </FilterSection>
      ) : null}

      <FilterSection title={t("productsPage.updatedFilter")}>
        <div role="radiogroup" aria-label={t("productsPage.updatedFilter")} className="flex flex-col gap-1">
          {UPDATED_PRESETS.map((preset) => (
            <FilterOption
              key={preset || "any"}
              selected={(query.updated ?? "") === preset}
              label={
                preset === ""
                  ? t("productsPage.updatedAny")
                  : t(`productsPage.updated${preset}` as "productsPage.updated7d")
              }
              onSelect={() =>
                update({ updated: (preset || undefined) as Exclude<UpdatedPreset, ""> | undefined })
              }
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h3>
      {children}
    </section>
  );
}

function FilterOption({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-sm transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "motion-reduce:transition-none",
        selected
          ? "bg-primary-soft font-medium text-primary"
          : "text-text-secondary hover:bg-background hover:text-text",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
          selected ? "border-primary bg-primary" : "border-border-strong bg-surface",
        )}
      >
        {selected ? <span className="size-1.5 rounded-full bg-surface" /> : null}
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}
