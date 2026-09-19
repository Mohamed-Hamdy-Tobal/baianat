import { ProductPrice } from "@/features/products/components/product-price";
import { cn } from "@/lib/utils";

type ProductSalePriceProps = {
  salePrice: number;
  listPrice: number;
  onSale: boolean;
  originalPriceLabel: string;
  saveLabel?: string;
  amountClassName?: string;
  className?: string;
  showSaveBadge?: boolean;
};

/** Shared sale / list price display — no pricing math; callers use discountedPrice utils. */
export function ProductSalePrice({
  salePrice,
  listPrice,
  onSale,
  originalPriceLabel,
  saveLabel,
  amountClassName,
  className,
  showSaveBadge = false,
}: ProductSalePriceProps) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <ProductPrice amount={salePrice} className={amountClassName} />
      {onSale ? (
        <span className="text-sm text-text-muted line-through">
          <span className="sr-only">{originalPriceLabel}: </span>
          <ProductPrice amount={listPrice} className="font-normal text-text-muted" />
        </span>
      ) : null}
      {onSale && showSaveBadge && saveLabel ? (
        <span className="rounded-md bg-error/10 px-2 py-0.5 text-xs font-medium text-error">{saveLabel}</span>
      ) : null}
    </div>
  );
}
