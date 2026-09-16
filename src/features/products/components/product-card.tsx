import Image from "next/image";
import { useTranslations } from "next-intl";

import { ProductPrice } from "@/features/products/components/product-price";
import { ProductRating } from "@/features/products/components/product-rating";
import type { Product } from "@/features/products/types/product";
import { categoryMessageKey } from "@/features/products/utils/find-category";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const tCategories = useTranslations("categories");

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors",
        "hover:border-border-strong",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transition-none",
        className,
      )}
    >
      <div className="relative aspect-square bg-background p-6">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-border p-4">
        <p className="text-xs font-medium text-text-muted">
          {tCategories(categoryMessageKey(product.category.labelKey))}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-text">{product.title}</h3>
        <ProductRating rate={product.rating.rate} count={product.rating.count} />
        <ProductPrice amount={product.price} className="mt-auto pt-1" />
      </div>
    </Link>
  );
}
