import Image from "next/image";
import { useTranslations } from "next-intl";

import { ProductRating } from "@/features/products/components/product-rating";
import { ProductSalePrice } from "@/features/products/components/product-sale-price";
import type { ProductSummary } from "@/features/products/types/product";
import { categoryMessageKey } from "@/features/products/utils/find-category";
import { discountedPrice, hasDiscount } from "@/features/products/utils/pricing";
import { ProductWishlistButton } from "@/features/wishlist/components/product-wishlist-button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: ProductSummary;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const tCategories = useTranslations("categories");
  const t = useTranslations("catalogue");
  const onSale = hasDiscount(product.discountPercentage);
  const salePrice = discountedPrice(product.price, product.discountPercentage);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors",
        "hover:border-border-strong",
        "motion-reduce:transition-none",
        className,
      )}
    >
      <div className="absolute end-3 top-3 z-20">
        <ProductWishlistButton product={product} />
      </div>

      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "flex h-full flex-col",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <div className="relative aspect-square bg-background p-6">
          {onSale ? (
            <span className="absolute start-3 top-3 z-10 rounded-md bg-error px-2 py-0.5 text-xs font-medium text-surface">
              {t("product.savePercent", { percent: Math.round(product.discountPercentage) })}
            </span>
          ) : null}
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 border-t border-border p-4">
          <p className="text-xs font-medium text-text-muted">
            {tCategories(categoryMessageKey(product.category.labelKey))}
          </p>
          {product.brand ? <p className="text-xs text-text-secondary">{product.brand}</p> : null}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-text">{product.title}</h3>
          <ProductRating rate={product.rating.rate} count={product.rating.count} />
          <div className="mt-auto pt-1">
            <ProductSalePrice
              salePrice={salePrice}
              listPrice={product.price}
              onSale={onSale}
              originalPriceLabel={t("product.originalPrice")}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
