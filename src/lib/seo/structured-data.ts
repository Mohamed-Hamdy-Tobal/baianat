import type { ProductDetails } from "@/features/products/types/product";
import { discountedPrice } from "@/features/products/utils/pricing";
import { absoluteImageUrl, localizedUrl, productUrl } from "@/lib/seo/urls";

export type JsonLdObject = Record<string, unknown>;

function omitUndefined<T extends Record<string, unknown>>(obj: T): JsonLdObject {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}

export function organizationJsonLd(name: string, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };
}

export function websiteJsonLd(name: string, url: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
  };
}

export function productJsonLd(product: ProductDetails, locale: string): JsonLdObject {
  const price = discountedPrice(product.price, product.discountPercentage);
  const images = product.images
    .map((src) => absoluteImageUrl(src))
    .filter((src): src is string => Boolean(src));
  const description = product.description.replace(/\s+/g, " ").trim();

  return omitUndefined({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: description || undefined,
    image: images.length > 0 ? images : undefined,
    sku: product.sku ?? undefined,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: productUrl(locale, product.slug),
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.rating.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating.rate,
            reviewCount: product.rating.count,
          }
        : undefined,
  });
}

export type BreadcrumbJsonLdItem = {
  name: string;
  /** Locale-agnostic path like `/` or `/products`. Omit for the current page. */
  path?: string;
};

export function breadcrumbJsonLd(items: BreadcrumbJsonLdItem[], locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) =>
      omitUndefined({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.path !== undefined ? localizedUrl(locale, item.path) : undefined,
      }),
    ),
  };
}

/** Safe JSON-LD serialization for embedding in a script tag. */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
