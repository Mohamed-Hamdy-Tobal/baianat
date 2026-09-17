"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { WishlistProductInput } from "@/features/wishlist/types/wishlist-item";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";
import { cn } from "@/lib/utils";

type ProductWishlistButtonProps = {
  product: WishlistProductInput;
  className?: string;
};

export function ProductWishlistButton({ product, className }: ProductWishlistButtonProps) {
  const t = useTranslations("wishlist");
  const hydrated = useStoreHydrated();
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const active = hydrated && isInWishlist;

  const label = active ? t("removeFromWishlist") : t("addToWishlist");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "size-9 rounded-full border border-border bg-surface/95 text-text-secondary shadow-sm",
        "hover:bg-surface hover:text-primary",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        active && "border-primary/30 text-primary",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(product);
      }}
    >
      <Heart
        aria-hidden
        className={cn("size-4", active && "fill-current")}
        strokeWidth={active ? 2.25 : 2}
      />
    </Button>
  );
}
