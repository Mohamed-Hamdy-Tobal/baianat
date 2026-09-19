import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Breadcrumbs } from "@/features/products/components/breadcrumbs";
import { CatalogueEmpty } from "@/features/products/components/catalogue-empty";
import { ProductFiltersMobile } from "@/features/products/components/catalogue/product-filters-mobile";
import { ProductFilterPanel } from "@/features/products/components/catalogue/product-filter-panel";
import { ProductPagination } from "@/features/products/components/catalogue/product-pagination";
import { ProductSearch } from "@/features/products/components/catalogue/product-search";
import { ProductSortSelect } from "@/features/products/components/catalogue/product-sort-select";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getCategories, getProductPage } from "@/features/products";
import type { ProductQuery } from "@/features/products/utils/product-query";

type ProductCatalogueViewProps = {
  query: ProductQuery;
  title: string;
  description?: string;
  breadcrumbLabel?: string;
  lockedCategory?: string;
  /** Category pages use Home → Categories → Category. */
  breadcrumbVariant?: "products" | "category";
};

export async function ProductCatalogueView({
  query,
  title,
  description,
  breadcrumbLabel,
  lockedCategory,
  breadcrumbVariant = "products",
}: ProductCatalogueViewProps) {
  const t = await getTranslations("catalogue");
  const [page, categories] = await Promise.all([getProductPage(query), getCategories()]);

  const breadcrumbItems =
    breadcrumbVariant === "category"
      ? [
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.categories"), href: "/categories" },
          ...(breadcrumbLabel ? [{ label: breadcrumbLabel }] : []),
        ]
      : [
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.products"), href: "/products" },
          ...(breadcrumbLabel ? [{ label: breadcrumbLabel }] : []),
        ];

  return (
    <div className="flex flex-col gap-8 py-2">
      <Breadcrumbs items={breadcrumbItems} />

      <header className="flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
            {description ? <p className="max-w-2xl text-sm text-text-secondary">{description}</p> : null}
          </div>
          <p className="text-sm text-text-secondary">{t("productsPage.count", { count: page.total })}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={null}>
            <ProductSearch lockedCategory={lockedCategory} />
          </Suspense>
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end lg:gap-3">
            <Suspense fallback={null}>
              <ProductFiltersMobile categories={categories} lockedCategory={lockedCategory} />
            </Suspense>
            <Suspense fallback={null}>
              <ProductSortSelect className="w-full lg:w-auto lg:min-w-44" lockedCategory={lockedCategory} />
            </Suspense>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-surface p-4 shadow-sm">
            <Suspense fallback={null}>
              <ProductFilterPanel categories={categories} lockedCategory={lockedCategory} />
            </Suspense>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-8">
          {page.products.length === 0 ? <CatalogueEmpty /> : <ProductGrid products={page.products} />}
          <ProductPagination query={query} totalPages={page.totalPages} />
        </div>
      </div>
    </div>
  );
}
