"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { getCartItemCount } from "@/features/cart/utils/cart-calculations";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

import { CartEmpty } from "./cart-empty";
import { CartItemList } from "./cart-item-list";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const t = useTranslations("cart");
  const hydrated = useStoreHydrated();
  const items = useCartStore((state) => state.items);
  const count = hydrated ? getCartItemCount(items) : 0;

  if (!hydrated) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true" aria-label={t("title")}>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t("title")}</h1>
          <p className="text-sm text-text-secondary">{t("subtitle")}</p>
        </header>
        <CartEmpty />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{t("title")}</h1>
            <span className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
              {t("itemCount", { count })}
            </span>
          </div>
          <p className="text-sm text-text-secondary">{t("subtitle")}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section aria-labelledby="cart-items-heading" className="flex min-w-0 flex-col gap-3">
          <h2 id="cart-items-heading" className="sr-only">
            {t("items")}
          </h2>
          <CartItemList />
        </section>
        <CartSummary />
      </div>
    </div>
  );
}
