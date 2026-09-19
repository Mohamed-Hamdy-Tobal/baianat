"use client";

import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { getCartItemCount, getCartSubtotal } from "@/features/cart/utils/cart-calculations";
import { useCartStore } from "@/features/cart/store/cart.store";
import { formatPrice } from "@/features/products/utils/format-price";
import { Link } from "@/i18n/navigation";

export function CartSummary() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = getCartSubtotal(items);
  const count = getCartItemCount(items);

  return (
    <aside className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm lg:sticky lg:top-24">
      <div className="border-b border-border bg-background/60 px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-text">{t("summary")}</h2>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <dl className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">{t("items")}</dt>
            <dd className="text-sm font-medium text-text">{t("itemCount", { count })}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-text-secondary">{t("shipping")}</dt>
            <dd className="text-sm font-medium text-success">{t("shippingFree")}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <dt className="text-sm font-medium text-text">{t("subtotal")}</dt>
            <dd className="text-lg font-semibold tracking-tight text-text">
              {formatPrice(subtotal, locale)}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2.5 pt-1">
          <Button asChild className="min-h-11 w-full">
            <Link href="/checkout">{t("checkout")}</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-text-secondary hover:text-error"
            onClick={() => clearCart()}
          >
            {t("clear")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
