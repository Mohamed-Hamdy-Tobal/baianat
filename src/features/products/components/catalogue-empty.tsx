"use client";

import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CatalogueEmptyProps = {
  className?: string;
  title?: string;
  description?: string;
  showCta?: boolean;
};

export function CatalogueEmpty({
  className,
  title,
  description,
  showCta = true,
}: CatalogueEmptyProps) {
  const t = useTranslations("catalogue");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <PackageOpen className="size-10 text-text-muted" aria-hidden />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-text">{title ?? t("empty.title")}</h2>
        <p className="max-w-sm text-sm text-text-secondary">{description ?? t("empty.description")}</p>
      </div>
      {showCta ? (
        <Button asChild>
          <Link href="/products">{t("empty.cta")}</Link>
        </Button>
      ) : null}
    </div>
  );
}
