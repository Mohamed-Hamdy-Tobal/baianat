"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

import { WishlistEmpty } from "./wishlist-empty";
import { WishlistItemCard } from "./wishlist-item-card";

export function WishlistView() {
  const t = useTranslations("wishlist");
  const hydrated = useStoreHydrated();
  const items = useWishlistStore((state) => state.items);

  if (!hydrated) {
    return (
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy="true"
        aria-label={t("title")}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="min-w-0">
            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="flex flex-col gap-2 border-t border-border p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="mt-2 h-5 w-1/3" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (items.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.productId} className="min-w-0">
          <WishlistItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
