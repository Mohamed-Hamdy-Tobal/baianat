"use client";

import { Check, MapPin, Package } from "lucide-react";
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
      sizes="64px"
      className="object-contain p-1.5"
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
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4" aria-busy="true" aria-label={t("success.title")}>
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto h-8 w-52" />
        <Skeleton className="mx-auto h-4 w-72" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-background text-text-muted">
          <Package className="size-6" aria-hidden />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-text">{t("success.missingTitle")}</h1>
          <p className="max-w-sm text-sm text-text-secondary">{t("success.missingDescription")}</p>
        </div>
        <Button asChild className="min-h-11 min-w-44">
          <Link href="/products">{t("success.continue")}</Link>
        </Button>
      </div>
    );
  }

  const customer = lastOrder.customer;
  const fullName = `${customer.firstName} ${customer.lastName}`.trim();
  const addressLine = [customer.address, customer.city, customer.country, customer.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 py-2">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-success/10 ring-8 ring-success/5">
          <div className="flex size-12 items-center justify-center rounded-full bg-success text-surface">
            <Check className="size-6" strokeWidth={2.5} aria-hidden />
          </div>
        </div>

        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {t("success.title")}
          </h1>
          <p className="text-sm text-text-secondary">{t("success.thankYou")}</p>
          <p className="text-sm text-text-secondary">{t("success.placed")}</p>
          <p className="mx-auto mt-1 inline-flex max-w-full items-center rounded-md bg-background px-2.5 py-1 font-mono text-xs text-text-secondary">
            {lastOrder.id}
          </p>
        </header>
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border bg-background/70 px-5 py-5">
          <div className="flex flex-col gap-1 text-start">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {t("success.orderTotal")}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-text">
              {formatPrice(lastOrder.total, locale)}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            {t("success.freeShipping")}
          </span>
        </div>

        <div className="flex flex-col gap-5 p-5 text-start">
          <dl className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-text-secondary">{t("success.orderNumber")}</dt>
              <dd className="font-mono text-sm font-medium text-text">{lastOrder.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm text-text-secondary">{t("success.shipping")}</dt>
              <dd className="text-sm font-medium text-success">{t("success.free")}</dd>
            </div>
          </dl>

          <section
            aria-labelledby="success-ship-to-heading"
            className="rounded-lg border border-border bg-background/50 p-4"
          >
            <div className="mb-2 flex items-center gap-2 text-text">
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
              <h2 id="success-ship-to-heading" className="text-sm font-semibold">
                {t("success.shipTo")}
              </h2>
            </div>
            <div className="flex flex-col gap-0.5 text-sm">
              <p className="font-medium text-text">{fullName}</p>
              <p className="text-text-secondary truncate">{customer.email}</p>
              <p className="text-text-secondary truncate">{customer.phone}</p>
              <p className="mt-1 text-text-secondary">{addressLine}</p>
            </div>
          </section>

          <section aria-labelledby="success-items-heading">
            <h2 id="success-items-heading" className="text-sm font-semibold text-text">
              {t("success.items")}
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {lastOrder.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-3 rounded-lg border border-border/80 bg-background/40 p-2.5"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-surface">
                    <OrderItemImage item={item} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-text">{item.title}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {t("summary.quantity", { count: item.quantity })}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-text">
                    {formatPrice(item.subtotal, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Button asChild className="min-h-11 w-full sm:w-auto sm:min-w-52">
        <Link href="/products">{t("success.continue")}</Link>
      </Button>
    </div>
  );
}
