import { PackageOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type CatalogueEmptyProps = {
  className?: string;
  title?: string;
  description?: string;
};

export function CatalogueEmpty({ className, title, description }: CatalogueEmptyProps) {
  const t = useTranslations("catalogue");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <PackageOpen className="size-10 text-text-muted" aria-hidden />
      <h2 className="text-lg font-semibold text-text">{title ?? t("empty.title")}</h2>
      <p className="max-w-sm text-sm text-text-secondary">{description ?? t("empty.description")}</p>
    </div>
  );
}
