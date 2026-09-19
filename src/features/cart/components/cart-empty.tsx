"use client";

import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CartEmptyProps = {
  className?: string;
};

export function CartEmpty({ className }: CartEmptyProps) {
  const t = useTranslations("cart");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-sm",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <ShoppingBag className="size-7" aria-hidden />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-text">{t("empty.title")}</h2>
        <p className="max-w-sm text-sm leading-relaxed text-text-secondary">{t("empty.description")}</p>
      </div>
      <Button asChild className="min-h-11 min-w-44">
        <Link href="/products">{t("empty.cta")}</Link>
      </Button>
    </div>
  );
}
