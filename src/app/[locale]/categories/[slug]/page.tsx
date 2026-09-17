import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCatalogueView } from "@/features/products/components/catalogue/product-catalogue-view";
import {
  categoryMessageKey,
  findCategoryBySlug,
  getCategories,
  parseProductSearchParams,
} from "@/features/products";
import { routing } from "@/i18n/routing";
import {
  breadcrumbJsonLd,
  isFilteredCatalogueQuery,
  JsonLd,
  publicPageMetadata,
} from "@/lib/seo";
import { MainContainer } from "@/components/layout/main-container";

type CategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await searchParams;
  const tSeo = await getTranslations({ locale, namespace: "seo" });
  const tCategories = await getTranslations({ locale, namespace: "categories" });

  try {
    const categories = await getCategories();
    const category = findCategoryBySlug(categories, slug);
    if (!category) {
      return {};
    }

    const categoryLabel = tCategories(categoryMessageKey(category.labelKey));
    const filtered = isFilteredCatalogueQuery({
      ...raw,
      // Category is locked in the path — do not treat path category as a filter.
      category: undefined,
    });

    return publicPageMetadata({
      locale,
      pathname: `/categories/${category.slug}`,
      title: tSeo("category.title", { category: categoryLabel }),
      description: tSeo("category.description", { category: categoryLabel }),
      siteName: tSeo("siteName"),
      index: !filtered,
      follow: true,
    });
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  await connection();

  const { locale, slug } = await params;
  const raw = await searchParams;
  const baseQuery = parseProductSearchParams(raw);

  const t = await getTranslations("catalogue");
  const tCategories = await getTranslations("categories");
  const categories = await getCategories();
  const category = findCategoryBySlug(categories, slug);

  if (!category) {
    notFound();
  }

  const query = {
    ...baseQuery,
    category: category.apiValue,
  };

  const categoryLabel = tCategories(categoryMessageKey(category.labelKey));

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), path: "/" },
    { name: t("breadcrumbs.categories"), path: "/categories" },
    { name: categoryLabel, path: `/categories/${category.slug}` },
  ];

  return (
    <div>
      <MainContainer>
        <JsonLd data={breadcrumbJsonLd(breadcrumbItems, locale)} />
        <ProductCatalogueView
          query={query}
          title={categoryLabel}
          breadcrumbLabel={categoryLabel}
          lockedCategory={category.apiValue}
          breadcrumbVariant="category"
        />
      </MainContainer>
    </div>
  );
}
