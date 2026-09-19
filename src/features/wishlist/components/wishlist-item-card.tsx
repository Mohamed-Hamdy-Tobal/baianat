"use client";

import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store/cart.store";
import { ProductPrice } from "@/features/products/components/product-price";
import { ProductRating } from "@/features/products/components/product-rating";
import type { WishlistItem } from "@/features/wishlist/types/wishlist-item";
import { ProductWishlistButton } from "@/features/wishlist/components/product-wishlist-button";
import { toCartSnapshotFromWishlist } from "@/features/wishlist/utils/to-cart-snapshot";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { Link } from "@/i18n/navigation";

type WishlistItemCardProps = {
  item: WishlistItem;
};

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const t = useTranslations("wishlist");
  const addSnapshot = useCartStore((state) => state.addSnapshot);
  const removeItem = useWishlistStore((state) => state.removeItem);

  const productInput = {
    id: item.productId,
    slug: item.slug,
    title: item.title,
    price: item.price,
    discountPercentage: 0,
    image: item.image,
    rating: item.rating,
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="absolute end-3 top-3 z-20">
        <ProductWishlistButton product={productInput} />
      </div>

      <Link
        href={`/products/${item.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-square bg-background p-6">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 border-t border-border p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-text">{item.title}</h3>
          {item.rating ? <ProductRating rate={item.rating.rate} count={item.rating.count} /> : null}
          <div className="mt-auto pt-1">
            <ProductPrice amount={item.price} />
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-2 border-t border-border p-4 pt-3 sm:flex-row">
        <Button
          type="button"
          size="sm"
          className="flex-1"
          onClick={() => addSnapshot(toCartSnapshotFromWishlist(item), 1)}
        >
          <ShoppingCart aria-hidden />
          {t("addToCart")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1"
          aria-label={t("removeItem", { title: item.title })}
          onClick={() => removeItem(item.productId)}
        >
          <Trash2 aria-hidden />
          {t("remove")}
        </Button>
      </div>
    </article>
  );
}
