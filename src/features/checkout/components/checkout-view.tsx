"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/features/cart/store/cart.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

import { CheckoutEmpty } from "./checkout-empty";
import { CheckoutForm } from "./checkout-form";

export function CheckoutView() {
  const t = useTranslations("checkout");
  const hydrated = useStoreHydrated();
  const items = useCartStore((state) => state.items);

  if (!hydrated) {
    return (
      <div
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
        aria-busy="true"
        aria-label={t("title")}
      >
        <div className="flex flex-col gap-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return <CheckoutEmpty />;
  }

  return <CheckoutForm items={items} />;
}
