import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import type { Metadata } from "next";

import { ProductCatalogueView } from "@/features/products/components/catalogue/product-catalogue-view";
import { parseProductSearchParams } from "@/features/products";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { MainContainer } from "@/components/layout/main-container";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogue" });

  return {
    title: t("productsPage.title"),
    description: t("productsPage.description"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/products`),
    },
    openGraph: {
      title: t("productsPage.title"),
      description: t("productsPage.description"),
      url: absoluteUrl(`/${locale}/products`),
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  await connection();
  const t = await getTranslations("catalogue");
  const raw = await searchParams;
  const query = parseProductSearchParams(raw);

  return (
    <div>
      <MainContainer>
        <ProductCatalogueView
          query={query}
          title={t("productsPage.title")}
          description={t("productsPage.description")}
        />
      </MainContainer>
    </div>
  );
}
