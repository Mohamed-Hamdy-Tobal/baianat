export {
  absoluteImageUrl,
  absoluteUrl,
  catalogueUrl,
  categoriesIndexUrl,
  categoryUrl,
  getSiteOrigin,
  isSafeRelativePath,
  languageAlternates,
  localizedUrl,
  productUrl,
  type LanguageAlternates,
} from "@/lib/seo/urls";

export {
  isFilteredCatalogueQuery,
  privatePageMetadata,
  productPageMetadata,
  publicPageMetadata,
  rootMetadataDefaults,
  truncateDescription,
  ogLocale,
} from "@/lib/seo/metadata";

export {
  breadcrumbJsonLd,
  organizationJsonLd,
  productJsonLd,
  serializeJsonLd,
  websiteJsonLd,
  type BreadcrumbJsonLdItem,
  type JsonLdObject,
} from "@/lib/seo/structured-data";

export {
  buildRobotsConfig,
  buildSitemapEntries,
} from "@/lib/seo/sitemap";

export { JsonLd } from "@/lib/seo/json-ld-script";
