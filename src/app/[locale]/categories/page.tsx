import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import type { Metadata } from "next";

import { MainContainer } from "@/components/layout/main-container";
import { Breadcrumbs } from "@/features/products/components/breadcrumbs";
import { CategoryGrid } from "@/features/products/components/categories/category-grid";
import { getCategoryPreviews } from "@/features/products";
import { breadcrumbJsonLd, JsonLd, publicPageMetadata } from "@/lib/seo";

type CategoriesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return publicPageMetadata({
    locale,
    pathname: "/categories",
    title: t("categories.title"),
    description: t("categories.description"),
    siteName: t("siteName"),
  });
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  await connection();

  const { locale } = await params;
  const t = await getTranslations("catalogue");
  const tSeo = await getTranslations("seo");
  const categories = await getCategoryPreviews();

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), path: "/" },
    { name: t("breadcrumbs.categories"), path: "/categories" },
  ];

  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-8 py-2">
          <JsonLd data={breadcrumbJsonLd(breadcrumbItems, locale)} />

          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.categories") },
            ]}
          />

          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-text">{tSeo("categories.title")}</h1>
            <p className="max-w-2xl text-sm text-text-secondary">{tSeo("categories.description")}</p>
          </header>

          {categories.length === 0 ? (
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-8">
              <h2 className="text-base font-semibold text-text">{t("categoriesPage.emptyTitle")}</h2>
              <p className="text-sm text-text-secondary">{t("categoriesPage.emptyDescription")}</p>
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </MainContainer>
    </div>
  );
}
