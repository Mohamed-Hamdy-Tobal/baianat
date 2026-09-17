"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";

import { getCartItemCount } from "@/features/cart/utils/cart-calculations";
import { useCartStore } from "@/features/cart/store/cart.store";
import { Link } from "@/i18n/navigation";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

type CartHeaderButtonProps = {
  className?: string;
};

export function CartHeaderButton({ className }: CartHeaderButtonProps) {
  const t = useTranslations("cart");
  const hydrated = useStoreHydrated();
  const items = useCartStore((state) => state.items);
  const count = hydrated ? getCartItemCount(items) : 0;

  return (
    <Link
      href="/cart"
      aria-label={t("headerCount", { count })}
      className={cn(
        "relative inline-flex size-10 items-center justify-center rounded-md text-text",
        "transition-transform duration-200 hover:scale-105 hover:bg-background",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "motion-reduce:hover:scale-100 motion-reduce:transition-none",
        className,
      )}
    >
      <ShoppingCart aria-hidden className="size-4" />
      {count > 0 ? (
        <span
          aria-hidden
          className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-surface"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
