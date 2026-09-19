import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CheckoutEmptyProps = {
  className?: string;
};

export function CheckoutEmpty({ className }: CheckoutEmptyProps) {
  const t = useTranslations("checkout");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <ShoppingBag className="size-10 text-text-muted" aria-hidden />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-text">{t("empty.title")}</h2>
        <p className="max-w-sm text-sm text-text-secondary">{t("empty.description")}</p>
      </div>
      <Button asChild>
        <Link href="/products">{t("empty.cta")}</Link>
      </Button>
    </div>
  );
}
