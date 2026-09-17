import { getTranslations, getLocale } from "next-intl/server";
import { connection } from "next/server";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { MainContainer } from "@/components/layout/main-container";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getLatestProducts } from "@/features/products";
import { getHomeBanners } from "@/features/home/api/banners.api";
import { HomeBannerSlider } from "@/features/home";
import { Link } from "@/i18n/navigation";
import { publicPageMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  return publicPageMetadata({
    locale,
    pathname: "/",
    title: t("home.title"),
    description: t("home.description"),
    absoluteTitle: true,
    siteName: t("siteName"),
  });
}

export default async function HomePage() {
  await connection();

  const locale = await getLocale();
  const t = await getTranslations("catalogue");
  const tHome = await getTranslations("home");

  const [latest, banners] = await Promise.all([getLatestProducts(4), getHomeBanners()]);

  return (
    <div className="flex flex-col">
      <HomeBannerSlider key={locale} slides={banners} />
      <p className="sr-only">
        {tHome("subtitle")}. {tHome("description")}
      </p>

      <MainContainer className="flex flex-col gap-12 py-10">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-text">{t("home.latestTitle")}</h2>
              <p className="text-sm text-text-secondary">{t("home.latestDescription")}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/products">{t("home.viewAllProducts")}</Link>
            </Button>
          </div>
          <ProductGrid products={latest} className="xl:grid-cols-4" />
        </section>
      </MainContainer>
    </div>
  );
}
