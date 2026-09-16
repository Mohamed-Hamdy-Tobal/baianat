import { useLocale } from "next-intl";

import { formatPrice } from "@/features/products/utils/format-price";
import { cn } from "@/lib/utils";

type ProductPriceProps = {
  amount: number;
  className?: string;
};

export function ProductPrice({ amount, className }: ProductPriceProps) {
  const locale = useLocale();

  return <span className={cn("font-semibold text-text tabular-nums", className)}>{formatPrice(amount, locale)}</span>;
}
