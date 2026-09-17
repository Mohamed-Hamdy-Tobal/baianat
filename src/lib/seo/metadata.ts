import type { Metadata } from "next";

import type { ProductDetails } from "@/features/products/types/product";
import type { Locale } from "@/i18n/routing";
import {
  absoluteImageUrl,
  getSiteOrigin,
  languageAlternates,
  localizedUrl,
} from "@/lib/seo/urls";

const DESCRIPTION_MAX = 160;

export function truncateDescription(text: string, max = DESCRIPTION_MAX): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= max) return collapsed;
  const slice = collapsed.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

export function ogLocale(locale: Locale | string): string {
  return locale === "ar" ? "ar" : "en_US";
}

type PublicPageMetadataInput = {
  locale: Locale | string;
  pathname: string;
  title: string;
  description: string;
  /** When true, title is used as absolute (no template suffix). */
  absoluteTitle?: boolean;
  siteName: string;
  image?: string | null;
  /** Indexable by default; set false for filtered catalogue URLs. */
  index?: boolean;
  follow?: boolean;
};

export function publicPageMetadata({
  locale,
  pathname,
  title,
  description,
  absoluteTitle = false,
  siteName,
  image,
  index = true,
  follow = true,
}: PublicPageMetadataInput): Metadata {
  const canonical = localizedUrl(locale, pathname);
  const languages = languageAlternates(pathname);
  const safeImage = absoluteImageUrl(image ?? undefined);
  const desc = truncateDescription(description);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: {
      canonical,
      languages,
    },
    robots: {
      index,
      follow,
    },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName,
      locale: ogLocale(locale),
      // Next.js Metadata API rejects og:type=product; Product semantics live in JSON-LD.
      type: "website",
      ...(safeImage ? { images: [{ url: safeImage }] } : {}),
    },
    twitter: {
      card: safeImage ? "summary_large_image" : "summary",
      title,
      description: desc,
      ...(safeImage ? { images: [safeImage] } : {}),
    },
  };
}

type ProductMetadataInput = {
  locale: Locale | string;
  product: ProductDetails;
  siteName: string;
};

export function productPageMetadata({
  locale,
  product,
  siteName,
}: ProductMetadataInput): Metadata {
  const pathname = `/products/${product.slug}`;
  const description = truncateDescription(product.description);
  const image = absoluteImageUrl(product.images[0] ?? product.image);

  return publicPageMetadata({
    locale,
    pathname,
    title: product.title,
    description,
    siteName,
    image,
  });
}

type PrivatePageMetadataInput = {
  title: string;
  description: string;
};

export function privatePageMetadata({ title, description }: PrivatePageMetadataInput): Metadata {
  return {
    title,
    description: truncateDescription(description),
    robots: {
      index: false,
      follow: false,
    },
  };
}

/** True when catalogue search params would create a filtered/paginated URL. */
export function isFilteredCatalogueQuery(
  searchParams: Record<string, string | string[] | undefined>,
): boolean {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = get("page");
  if (page && page !== "1") return true;
  if (get("q")?.trim()) return true;
  if (get("category")?.trim()) return true;
  const sort = get("sort");
  if (sort && sort !== "default") return true;
  if (get("updated")?.trim()) return true;
  return false;
}

export function rootMetadataDefaults(locale: Locale | string, siteName: string, description: string): Metadata {
  const origin = getSiteOrigin();

  return {
    metadataBase: new URL(origin),
    title: {
      default: siteName,
      template: `%s — ${siteName}`,
    },
    description: truncateDescription(description),
    openGraph: {
      siteName,
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary",
    },
  };
}
