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
    <div className="flex flex-col gap-4 border-t border-border pt-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">{t("product.quantity")}</span>
        <QuantityStepper
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

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="min-w-40"
          disabled={outOfStock}
          onClick={() => {
            if (outOfStock) return;
            addItem(product, quantity);
          }}
        >
          <ShoppingCart aria-hidden />
          {outOfStock ? t("product.outOfStock") : t("product.addToCart")}
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-pressed={wishlisted}
          aria-label={wishlistLabel}
          onClick={() => toggleItem(product)}
          className={cn(wishlisted && "border-primary/40 text-primary")}
        >
          <Heart aria-hidden className={cn(wishlisted && "fill-current")} />
          {wishlistLabel}
        </Button>
      </div>
    </div>
  );
}
