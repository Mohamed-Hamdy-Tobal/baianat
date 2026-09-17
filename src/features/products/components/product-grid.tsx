import { ProductCard } from "@/features/products/components/product-card";
import type { ProductSummary } from "@/features/products/types/product";
import { cn } from "@/lib/utils";

type ProductGridProps = {
  products: ProductSummary[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
