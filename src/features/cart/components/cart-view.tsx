"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

import { CartEmpty } from "./cart-empty";
import { CartItemList } from "./cart-item-list";
import { CartSummary } from "./cart-summary";

export function CartView() {
  const t = useTranslations("cart");
  const hydrated = useStoreHydrated();
  const items = useCartStore((state) => state.items);

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]" aria-busy="true" aria-label={t("title")}>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section aria-labelledby="cart-items-heading" className="flex flex-col gap-4">
        <h2 id="cart-items-heading" className="text-base font-semibold text-text">
          {t("items")}
        </h2>
        <CartItemList />
      </section>
      <CartSummary />
    </div>
  );
}
