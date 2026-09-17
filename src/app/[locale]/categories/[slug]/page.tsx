import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { ProductCatalogueView } from "@/features/products/components/catalogue/product-catalogue-view";
import {
  categoryMessageKey,
  findCategoryBySlug,
  getCategories,
  parseProductSearchParams,
} from "@/features/products";
import { routing } from "@/i18n/routing";
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  await connection();

  const { slug } = await params;
  const raw = await searchParams;
  const baseQuery = parseProductSearchParams(raw);

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

  return (
    <div>
      <MainContainer>
        <ProductCatalogueView
          query={query}
          title={categoryLabel}
          breadcrumbLabel={categoryLabel}
          lockedCategory={category.apiValue}
        />
      </MainContainer>
    </div>
  );
}
