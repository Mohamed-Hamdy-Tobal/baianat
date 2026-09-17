"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useStoreHydrated } from "@/lib/store/use-store-hydrated";

import { WishlistEmpty } from "./wishlist-empty";
import { WishlistItemCard } from "./wishlist-item-card";

export function WishlistView() {
  const hydrated = useStoreHydrated();
  const items = useWishlistStore((state) => state.items);

  if (!hydrated) {
    return (
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <li key={index}>
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
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
