import { getLocale, getTranslations } from "next-intl/server";

import type { ProductDetails } from "@/features/products/types/product";

type ProductSpecsProps = {
  product: ProductDetails;
};

export async function ProductSpecs({ product }: ProductSpecsProps) {
  const t = await getTranslations("catalogue");
  const locale = await getLocale();

  const rows: Array<{ label: string; value: string }> = [];

  if (product.brand) rows.push({ label: t("product.brand"), value: product.brand });
  if (product.sku) rows.push({ label: t("product.sku"), value: product.sku });
  rows.push({ label: t("product.stock"), value: String(product.stock) });
  if (product.availabilityStatus) {
    rows.push({ label: t("product.availability"), value: product.availabilityStatus });
  }
  if (product.weight != null) {
    rows.push({ label: t("product.weight"), value: `${product.weight}` });
  }
  if (product.dimensions) {
    const { width, height, depth } = product.dimensions;
    rows.push({
      label: t("product.dimensions"),
      value: `${width} × ${height} × ${depth}`,
    });
  }
  if (product.warrantyInformation) {
    rows.push({ label: t("product.warranty"), value: product.warrantyInformation });
  }
  if (product.shippingInformation) {
    rows.push({ label: t("product.shipping"), value: product.shippingInformation });
  }
  if (product.returnPolicy) {
    rows.push({ label: t("product.returns"), value: product.returnPolicy });
  }
  if (product.minimumOrderQuantity != null) {
    rows.push({
      label: t("product.minOrder"),
      value: new Intl.NumberFormat(locale).format(product.minimumOrderQuantity),
    });
  }
  if (product.barcode) {
    rows.push({ label: t("product.barcode"), value: product.barcode });
  }
  if (product.tags.length > 0) {
    rows.push({ label: t("product.tags"), value: product.tags.join(", ") });
  }

  if (rows.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8" aria-labelledby="product-specs">
      <h2 id="product-specs" className="text-lg font-semibold text-text">
        {t("product.information")}
      </h2>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 border-b border-border pb-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{row.label}</dt>
            <dd className="text-sm text-text-secondary">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
