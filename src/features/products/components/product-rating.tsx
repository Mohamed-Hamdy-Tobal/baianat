import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type ProductRatingProps = {
  rate: number;
  count: number;
  className?: string;
};

export function ProductRating({ rate, count, className }: ProductRatingProps) {
  const t = useTranslations("catalogue");
  const filled = Math.round(rate);

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 text-sm text-text-secondary", className)}
      aria-label={t("rating.a11y", { rate, count })}
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn("size-3.5", index < filled ? "fill-accent text-accent" : "fill-transparent text-border-strong")}
          />
        ))}
      </span>
      <span aria-hidden className="tabular-nums">
        {rate.toFixed(1)}
        <span className="text-text-muted"> ({count})</span>
      </span>
    </div>
  );
}
