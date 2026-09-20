"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCartStore } from "@/features/cart/store/cart.store";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/features/cart/utils/quantity";
import type { ProductSummary } from "@/features/products/types/product";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

type ProductPurchaseActionsProps = {
  product: ProductSummary;
  outOfStock?: boolean;
};

export function ProductPurchaseActions({ product, outOfStock = false }: ProductPurchaseActionsProps) {
  const t = useTranslations("catalogue");
  const tWishlist = useTranslations("wishlist");
  const hydrated = useStoreHydrated();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const wishlisted = hydrated && isInWishlist;

  const wishlistLabel = wishlisted ? tWishlist("removeFromWishlist") : tWishlist("addToWishlist");

  return (
    <div className="flex w-full flex-col gap-4 border-t border-border pt-5">
      <div className="flex w-full flex-col gap-2">
        <span className="text-sm font-medium text-text">{t("product.quantity")}</span>
        <QuantityStepper
          className="w-full"
          size="touch"
          value={quantity}
          onChange={setQuantity}
          min={MIN_QUANTITY}
          max={outOfStock ? MIN_QUANTITY : MAX_QUANTITY}
          disabled={outOfStock}
          inputLabel={t("product.quantity")}
          decrementLabel={t("product.decreaseQuantity")}
          incrementLabel={t("product.increaseQuantity")}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <Button
          type="button"
          className="h-11 w-full text-sm md:text-base"
          disabled={outOfStock}
          onClick={() => {
            if (outOfStock) return;
            addItem(product, quantity);
          }}
        >
          <ShoppingCart aria-hidden className="shrink-0" />
          <span className="truncate text-sm md:text-base">{outOfStock ? t("product.outOfStock") : t("product.addToCart")}</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-pressed={wishlisted}
          aria-label={wishlistLabel}
          onClick={() => toggleItem(product)}
          className={cn("h-11 w-full text-sm md:text-base", wishlisted && "border-primary/40 text-primary")}
        >
          <Heart aria-hidden className={cn("shrink-0", wishlisted && "fill-current")} />
          <span className="truncate text-sm md:text-base">{wishlistLabel}</span>
        </Button>
      </div>
    </div>
  );
}
