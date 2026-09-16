import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/features/products/components/breadcrumbs";
import { CatalogueEmpty } from "@/features/products/components/catalogue-empty";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductSortSelect } from "@/features/products/components/product-sort-select";
import {
  categoryMessageKey,
  findCategoryBySlug,
  getCategories,
  getProductsByCategory,
  parseProductSort,
  sortProducts,
} from "@/features/products";
import { routing } from "@/i18n/routing";

type CategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sort?: string | string[] }>;
};

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return routing.locales.flatMap((locale) =>
      categories.map((category) => ({
        locale,
        slug: category.slug,
      })),
    );
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  await connection();

  const { slug } = await params;
  const query = await searchParams;
  const sortParam = Array.isArray(query.sort) ? query.sort[0] : query.sort;
  const sort = parseProductSort(sortParam);

  const t = await getTranslations("catalogue");
  const tCategories = await getTranslations("categories");

  const categories = await getCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    notFound();
  }

  const products = sortProducts(await getProductsByCategory(category.apiValue), sort);
  const categoryLabel = tCategories(categoryMessageKey(category.labelKey));

  return (
    <div className="flex flex-col gap-8 py-2">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.categories"), href: "/categories" },
          { label: categoryLabel },
        ]}
      />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-text">{categoryLabel}</h1>
          <p className="text-sm text-text-secondary">{t("categoryPage.productCount", { count: products.length })}</p>
        </div>
        <Suspense fallback={null}>
          <ProductSortSelect />
        </Suspense>
      </header>

      {products.length === 0 ? <CatalogueEmpty /> : <ProductGrid products={products} />}
    </div>
  );
}
