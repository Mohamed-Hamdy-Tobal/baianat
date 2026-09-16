import { getTranslations } from "next-intl/server";
import { connection } from "next/server";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/features/products/components/category-card";
import { ProductGrid } from "@/features/products/components/product-grid";
import { getCategories, getProducts } from "@/features/products";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  await connection();

  const t = await getTranslations("catalogue");
  const tHome = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const featured = products.slice(0, 8);

  return (
    <div className="flex flex-col gap-12 py-2">
      <section className="flex flex-col gap-4 border-b border-border pb-10">
        <p className="text-sm font-medium text-primary">{tCommon("brand.name")}</p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-text sm:text-4xl">{t("home.heroTitle")}</h1>
        <p className="max-w-xl text-base text-text-secondary">{t("home.heroDescription")}</p>
        <div className="pt-1">
          <Button asChild>
            <Link href="/categories">{t("home.shopCategories")}</Link>
          </Button>
        </div>
        <p className="sr-only">
          {tHome("subtitle")}. {tHome("description")}
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-text">{t("home.featuredTitle")}</h2>
            <p className="text-sm text-text-secondary">{t("home.featuredDescription")}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/categories">{t("home.viewAllCategories")}</Link>
          </Button>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-text">{t("home.shopByCategory")}</h2>
          <p className="text-sm text-text-secondary">{t("home.shopByCategoryDescription")}</p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
