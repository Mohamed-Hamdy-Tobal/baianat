import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NotFoundError } from "@/lib/api/errors";
import { Breadcrumbs } from "@/features/products/components/breadcrumbs";
import { ProductGallery } from "@/features/products/components/details/product-gallery";
import { ProductPurchaseActions } from "@/features/products/components/details/product-purchase-actions";
import { ProductReviews } from "@/features/products/components/details/product-reviews";
import { ProductSpecs } from "@/features/products/components/details/product-specs";
import { RelatedProducts } from "@/features/products/components/details/related-products";
import { ProductPrice } from "@/features/products/components/product-price";
import { ProductRating } from "@/features/products/components/product-rating";
import {
  categoryMessageKey,
  discountedPrice,
  getProductById,
  getProductSlugParams,
  getRelatedProducts,
  hasDiscount,
  parseProductSlug,
} from "@/features/products";
import { Link, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo/absolute-url";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/json-ld";
import { JsonLd } from "@/lib/seo/json-ld-script";
import { MainContainer } from "@/components/layout/main-container";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await getProductSlugParams();
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

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const id = parseProductSlug(slug);

  if (id === null) {
    return {};
  }

  try {
    const product = await getProductById(id);
    const description = product.description.slice(0, 160);
    const url = absoluteUrl(`/${localeParam}/products/${product.slug}`);

    return {
      title: product.title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: product.title,
        description,
        url,
        images: product.images[0] ? [{ url: product.images[0] }] : undefined,
      },
    };
  } catch {
    return {};
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

  const related = await getRelatedProducts(product.category.apiValue, product.id);
  const t = await getTranslations("catalogue");
  const tCategories = await getTranslations("categories");
  const categoryLabel = tCategories(categoryMessageKey(product.category.labelKey));
  const onSale = hasDiscount(product.discountPercentage);
  const salePrice = discountedPrice(product.price, product.discountPercentage);
  const outOfStock = product.stock <= 0;

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), path: "/" },
    { name: t("breadcrumbs.products"), path: "/products" },
    { name: categoryLabel, path: `/categories/${product.category.slug}` },
    { name: product.title },
  ];

  return (
    <div>
      <MainContainer>
        <div className="flex flex-col gap-10 py-2">
          <JsonLd data={productJsonLd(product, locale)} />
          <JsonLd data={breadcrumbJsonLd(breadcrumbItems, locale)} />

          <Breadcrumbs
            items={[
              { label: t("breadcrumbs.home"), href: "/" },
              { label: t("breadcrumbs.products"), href: "/products" },
              { label: categoryLabel, href: `/categories/${product.category.slug}` },
              { label: product.title },
            ]}
          />

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductGallery images={product.images} title={product.title} />

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
                {product.brand ? <p className="text-sm text-text-secondary">{product.brand}</p> : null}
                <h1 className="text-2xl font-semibold tracking-tight text-text sm:text-3xl">{product.title}</h1>
                <ProductRating rate={product.rating.rate} count={product.rating.count} />
                <div className="flex flex-wrap items-baseline gap-3">
                  <ProductPrice amount={salePrice} className="text-2xl" />
                  {onSale ? (
                    <span className="text-base text-text-muted line-through">
                      <span className="sr-only">{t("product.originalPrice")}: </span>
                      <ProductPrice amount={product.price} className="font-normal text-text-muted" />
                    </span>
                  ) : null}
                  {onSale ? (
                    <span className="rounded-md bg-error/10 px-2 py-0.5 text-xs font-medium text-error">
                      {t("product.savePercent", { percent: Math.round(product.discountPercentage) })}
                    </span>
                  ) : null}
                </div>
                {product.availabilityStatus ? (
                  <p className="text-sm text-text-secondary">
                    {t("product.availability")}: {product.availabilityStatus}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 border-t border-border pt-5">
                <h2 className="text-sm font-semibold text-text">{t("product.description")}</h2>
                <p className="text-sm leading-relaxed text-text-secondary">{product.description}</p>
              </div>

              <ProductPurchaseActions product={product} outOfStock={outOfStock} />
            </div>
          </div>

          <ProductSpecs product={product} />
          <ProductReviews reviews={product.reviews} />
          <RelatedProducts products={related} />
        </div>
      </MainContainer>
    </div>
  );
}
