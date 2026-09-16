import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { NotFoundError } from "@/lib/api/errors";
import { Breadcrumbs } from "@/features/products/components/breadcrumbs";
import { ProductPrice } from "@/features/products/components/product-price";
import { ProductRating } from "@/features/products/components/product-rating";
import {
  categoryMessageKey,
  getProductById,
  getProducts,
  parseProductSlug,
} from "@/features/products";
import { Link, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return routing.locales.flatMap((locale) =>
      products.map((product) => ({
        locale,
        slug: product.slug,
      })),
    );
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  await connection();

  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const id = parseProductSlug(slug);

  if (id === null) {
    notFound();
  }

  let product;

  try {
    product = await getProductById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  if (slug !== product.slug) {
    redirect({ href: `/products/${product.slug}`, locale });
  }

  const t = await getTranslations("catalogue");
  const tCategories = await getTranslations("categories");
  const categoryLabel = tCategories(categoryMessageKey(product.category.labelKey));

  return (
    <div className="flex flex-col gap-8 py-2">
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), href: "/" },
          { label: t("breadcrumbs.categories"), href: "/categories" },
          { label: categoryLabel, href: `/categories/${product.category.slug}` },
          { label: product.title },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface p-8">
          <Image
            src={product.image}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-text-muted">
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {categoryLabel}
              </Link>
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{product.title}</h1>
            <ProductRating rate={product.rating.rate} count={product.rating.count} />
            <ProductPrice amount={product.price} className="text-2xl" />
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <h2 className="text-sm font-semibold text-text">{t("product.description")}</h2>
            <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
