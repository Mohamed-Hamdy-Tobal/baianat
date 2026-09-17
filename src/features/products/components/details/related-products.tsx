import { getTranslations } from "next-intl/server";

import { ProductGrid } from "@/features/products/components/product-grid";
import type { ProductSummary } from "@/features/products/types/product";

type RelatedProductsProps = {
  products: ProductSummary[];
};

export async function RelatedProducts({ products }: RelatedProductsProps) {
  const t = await getTranslations("catalogue");

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8" aria-labelledby="related-products">
      <h2 id="related-products" className="text-lg font-semibold text-text">
        {t("product.related")}
      </h2>
      {products.length === 0 ? (
        <p className="text-sm text-text-secondary">{t("product.noRelated")}</p>
      ) : (
        <ProductGrid products={products} className="xl:grid-cols-4" />
      )}
    </section>
  );
}
