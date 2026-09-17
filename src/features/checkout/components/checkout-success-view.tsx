"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderStore } from "@/features/checkout/store/order.store";
import type { OrderItem } from "@/features/checkout/types/order";
import { formatPrice } from "@/features/products/utils/format-price";
import { Link } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

function OrderItemImage({ item }: { item: OrderItem }) {
  const [failed, setFailed] = useState(!item.image);

  if (failed) {
    return <div className="size-full bg-background" aria-hidden />;
  }

  return (
    <Image
      src={item.image}
      alt={item.title}
      fill
      sizes="48px"
      className="object-contain p-1"
      onError={() => setFailed(true)}
    />
  );
}

export function CheckoutSuccessView() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const hydrated = useStoreHydrated();
  const lastOrder = useOrderStore((state) => state.lastOrder);

  if (!hydrated) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4" aria-busy="true" aria-label={t("success.title")}>
        <Skeleton className="mx-auto size-12 rounded-full" />
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-72" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-surface px-6 py-16 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-text">{t("success.missingTitle")}</h1>
          <p className="max-w-sm text-sm text-text-secondary">{t("success.missingDescription")}</p>
        </div>
        <Button asChild>
          <Link href="/products">{t("success.continue")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-2 text-center">
      <CheckCircle2 className="size-12 text-success" aria-hidden />

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{t("success.title")}</h1>
        <p className="text-sm text-text-secondary">{t("success.thankYou")}</p>
        <p className="text-sm text-text-secondary">
          {t("success.placed", { orderId: lastOrder.id })}
        </p>
      </header>

      <div className="w-full rounded-lg border border-border bg-surface p-5 text-start">
        <dl className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">{t("success.orderNumber")}</dt>
            <dd className="text-sm font-semibold text-text">{lastOrder.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">{t("success.orderTotal")}</dt>
            <dd className="text-base font-semibold text-text">
              {formatPrice(lastOrder.total, locale)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">{t("success.shipping")}</dt>
            <dd className="text-sm font-medium text-success">{t("success.free")}</dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-border pt-4">
          <h2 className="text-sm font-semibold text-text">{t("success.items")}</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {lastOrder.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                  <OrderItemImage item={item} />
                </div>
                <div className="min-w-0 flex-1 text-start">
                  <p className="line-clamp-2 text-sm font-medium text-text">{item.title}</p>
                  <p className="text-xs text-text-muted">
                    {t("summary.quantity", { count: item.quantity })}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-text">
                  {formatPrice(item.subtotal, locale)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button asChild className="min-h-11 w-full sm:w-auto sm:min-w-48">
        <Link href="/products">{t("success.continue")}</Link>
      </Button>
    </div>
  );
}
