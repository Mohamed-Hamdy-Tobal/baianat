import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import type { Metadata } from "next";

import { ProductCatalogueView } from "@/features/products/components/catalogue/product-catalogue-view";
import { parseProductSearchParams } from "@/features/products";
import { isFilteredCatalogueQuery, publicPageMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { MainContainer } from "@/components/layout/main-container";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const raw = await searchParams;
  const t = await getTranslations({ locale, namespace: "seo" });
  const filtered = isFilteredCatalogueQuery(raw);

  return publicPageMetadata({
    locale,
    pathname: "/products",
    title: t("products.title"),
    description: t("products.description"),
    siteName: t("siteName"),
    index: !filtered,
    follow: true,
  });
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  await connection();
  const { locale } = await params;
  const t = await getTranslations("catalogue");
  const tSeo = await getTranslations("seo");
  const raw = await searchParams;
  const query = parseProductSearchParams(raw);

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), path: "/" },
    { name: t("breadcrumbs.products"), path: "/products" },
  ];

  return (
    <div>
      <MainContainer>
        <JsonLd data={breadcrumbJsonLd(breadcrumbItems, locale)} />
        <ProductCatalogueView
          query={query}
          title={tSeo("products.title")}
          description={tSeo("products.description")}
        />
      </MainContainer>
    </div>
  );
}
