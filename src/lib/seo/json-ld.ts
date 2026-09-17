import type { ProductDetails } from "@/features/products/types/product";
import { discountedPrice } from "@/features/products/utils/pricing";
import { absoluteUrl } from "@/lib/seo/absolute-url";

export function productJsonLd(product: ProductDetails, locale: string) {
  const price = discountedPrice(product.price, product.discountPercentage);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.sku ?? undefined,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/${locale}/products/${product.slug}`),
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
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path?: string }>, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? absoluteUrl(`/${locale}${item.path === "/" ? "" : item.path}`) : undefined,
    })),
  };
}
