"use client";

import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { getCartItemCount, getCartSubtotal } from "@/features/cart/utils/cart-calculations";
import { useCartStore } from "@/features/cart/store/cart.store";
import { formatPrice } from "@/features/products/utils/format-price";

export function CartSummary() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = getCartSubtotal(items);
  const count = getCartItemCount(items);

  return (
    <aside className="rounded-lg border border-border bg-surface p-5 lg:sticky lg:top-24">
      <h2 className="text-base font-semibold text-text">{t("summary")}</h2>

      <dl className="mt-4 flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-text-secondary">{t("subtotal")}</dt>
          <dd className="text-base font-semibold text-text">{formatPrice(subtotal, locale)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-sm text-text-secondary">{t("items")}</dt>
          <dd className="text-sm text-text">{t("itemCount", { count })}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-col gap-3">
        <Button type="button" className="w-full" disabled title={t("checkoutUnavailable")}>
          {t("checkout")}
        </Button>
        <Button type="button" variant="ghost" className="w-full text-text-secondary" onClick={() => clearCart()}>
          {t("clear")}
        </Button>
      </div>
    </aside>
  );
}
