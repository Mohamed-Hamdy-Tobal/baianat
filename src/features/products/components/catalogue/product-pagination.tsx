"use client";

import { useTranslations } from "next-intl";

import {
  serializeProductSearchParams,
  type ProductQuery,
} from "@/features/products/utils/product-query";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProductPaginationProps = {
  query: ProductQuery;
  totalPages: number;
  className?: string;
};

function pageWindow(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1, current - 2, current + 2]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
}

export function ProductPagination({ query, totalPages, className }: ProductPaginationProps) {
  const t = useTranslations("catalogue");
  const pathname = usePathname();

  if (totalPages <= 1) return null;

  const pages = pageWindow(query.page, totalPages);

  const hrefFor = (page: number) => ({
    pathname,
    query: serializeProductSearchParams({ ...query, page }),
  });

  return (
    <nav aria-label={t("pagination.label")} className={cn("flex flex-wrap items-center justify-end gap-2", className)}>
      <PaginationLink
        href={hrefFor(Math.max(1, query.page - 1))}
        disabled={query.page <= 1}
        label={t("pagination.previous")}
      />

      {pages.map((page, index) => {
        const prev = pages[index - 1];
        const showEllipsis = prev !== undefined && page - prev > 1;

        return (
          <span key={page} className="inline-flex items-center gap-2">
            {showEllipsis ? <span className="px-1 text-text-muted">…</span> : null}
            <Link
              href={hrefFor(page)}
              aria-label={t("pagination.page", { page })}
              aria-current={page === query.page ? "page" : undefined}
              className={cn(
                "inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                page === query.page
                  ? "border-primary bg-primary text-surface"
                  : "border-border bg-surface text-text hover:border-border-strong",
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      <PaginationLink
        href={hrefFor(Math.min(totalPages, query.page + 1))}
        disabled={query.page >= totalPages}
        label={t("pagination.next")}
      />
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  label,
}: {
  href: { pathname: string; query: Record<string, string> };
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex h-10 items-center rounded-md border border-border px-3 text-sm text-text-muted opacity-50">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center rounded-md border border-border bg-surface px-3 text-sm text-text transition-colors",
        "hover:border-border-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {label}
    </Link>
  );
}
