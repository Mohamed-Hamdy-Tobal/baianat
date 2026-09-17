"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import type { CartItem } from "@/features/cart/types/cart-item";
import { getCartItemSubtotal } from "@/features/cart/utils/cart-calculations";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/features/cart/utils/quantity";
import { useCartStore } from "@/features/cart/store/cart.store";
import { formatPrice } from "@/features/products/utils/format-price";
import { Link } from "@/i18n/navigation";

type CartItemRowProps = {
  item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const lineTotal = getCartItemSubtotal(item);

  return (
    <li className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex gap-4">
        <Link
          href={`/products/${item.slug}`}
          className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-background sm:size-24"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-contain p-2"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex flex-col gap-1">
              <Link
                href={`/products/${item.slug}`}
                className="line-clamp-2 text-sm font-medium text-text hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.title}
              </Link>
              <p className="text-sm text-text-secondary">{formatPrice(item.price, locale)}</p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 shrink-0 text-text-muted hover:text-error"
              aria-label={t("removeItem", { title: item.title })}
              onClick={() => removeItem(item.productId)}
            >
              <X aria-hidden className="size-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <QuantityStepper
              size="touch"
              value={item.quantity}
              onChange={(next) => updateQuantity(item.productId, next)}
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              inputLabel={t("quantity")}
              decrementLabel={t("decreaseQuantity")}
              incrementLabel={t("increaseQuantity")}
            />
            <p className="text-sm font-semibold text-text">
              <span className="me-2 text-text-muted font-normal sm:hidden">{t("lineTotal")}</span>
              {formatPrice(lineTotal, locale)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
