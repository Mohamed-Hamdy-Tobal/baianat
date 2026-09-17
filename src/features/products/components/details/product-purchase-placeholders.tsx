"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

type ProductPurchasePlaceholdersProps = {
  outOfStock?: boolean;
};

/** Presentational purchase controls — cart/wishlist are not wired in Phase 06. */
export function ProductPurchasePlaceholders({ outOfStock = false }: ProductPurchasePlaceholdersProps) {
  const t = useTranslations("catalogue");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4 border-t border-border pt-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">{t("product.quantity")}</span>
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={outOfStock ? 1 : 99}
          disabled={outOfStock}
          inputLabel={t("product.quantity")}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled className="min-w-40" aria-disabled>
          <ShoppingCart aria-hidden />
          {outOfStock ? t("product.outOfStock") : t("product.addToCart")}
        </Button>
        <Button type="button" variant="outline" disabled aria-disabled>
          <Heart aria-hidden />
          {t("product.wishlist")}
        </Button>
      </div>
    </div>
  );
}
