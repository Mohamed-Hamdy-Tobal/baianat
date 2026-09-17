"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import type { CartItem } from "@/features/cart/types/cart-item";
import { getCartItemSubtotal } from "@/features/cart/utils/cart-calculations";
import {
  calculateOrderSubtotal,
  calculateOrderTotal,
} from "@/features/checkout/utils/order-calculations";
import { formatPrice } from "@/features/products/utils/format-price";
import { cn } from "@/lib/utils";

type CheckoutSummaryProps = {
  items: CartItem[];
  className?: string;
  /** When true, renders the Place order button slot (desktop sticky column). */
  actions?: React.ReactNode;
};

function SummaryImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return <div className="size-full bg-background" aria-hidden />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="64px"
      className="object-contain p-1.5"
      onError={() => setFailed(true)}
    />
  );
}

export function CheckoutSummary({ items, className, actions }: CheckoutSummaryProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const subtotal = calculateOrderSubtotal(items);
  const total = calculateOrderTotal(items);

  return (
    <aside
      className={cn(
        "rounded-lg border border-border bg-surface p-5 lg:sticky lg:top-24",
        className,
      )}
    >
      <h2 className="text-base font-semibold text-text">{t("summary.title")}</h2>

      <ul className="mt-4 flex flex-col gap-3 border-b border-border pb-4">
        {items.map((item) => {
          const lineTotal = getCartItemSubtotal(item);
          return (
            <li key={item.productId} className="flex gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                <SummaryImage src={item.image} alt={item.title} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-text">{item.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {t("summary.quantity", { count: item.quantity })}
                  <span className="mx-1.5 text-border-strong" aria-hidden>
                    ·
                  </span>
                  {t("summary.unitPrice", { price: formatPrice(item.price, locale) })}
                </p>
              </div>
              <p className="shrink-0 text-sm font-medium text-text">
                {formatPrice(lineTotal, locale)}
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-text-secondary">{t("summary.subtotal")}</dt>
          <dd className="text-sm text-text">{formatPrice(subtotal, locale)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-text-secondary">{t("summary.shipping")}</dt>
          <dd className="text-sm font-medium text-success">{t("summary.free")}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <dt className="text-sm font-semibold text-text">{t("summary.total")}</dt>
          <dd className="text-base font-semibold text-text">{formatPrice(total, locale)}</dd>
        </div>
      </dl>

      {actions ? <div className="mt-5">{actions}</div> : null}
    </aside>
  );
}
