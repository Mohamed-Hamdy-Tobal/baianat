export type { Product, ProductSummary, ProductDetails, ProductReview } from "./types/product";
export type { Category } from "./types/category";
export type { CategoryPreview } from "./types/category-preview";
export {
  getProducts,
  getProductById,
  getProductsByCategory,
  getProductSlugParams,
  getProductPage,
  getLatestProducts,
  getRelatedProducts,
  getProductSummaryById,
} from "./api/products.api";
export { getCategories, getCategoryPreviews } from "./api/categories.api";
export { parseProductSlug, buildProductSlug, slugify } from "./utils/product-slug";
export { findCategoryBySlug, categoryMessageKey } from "./utils/find-category";
export { formatCategoryDisplayName } from "./utils/format-category-display-name";
export { resolveCategoryLabel } from "./utils/resolve-category-label";
export {
  parseProductSearchParams,
  serializeProductSearchParams,
  PAGE_SIZE,
  totalPages,
  PRODUCT_SORT_OPTIONS,
  type ProductQuery,
  type ProductSortOption,
  type ProductPageResult,
} from "./utils/product-query";
export { formatPrice } from "./utils/format-price";
export { discountedPrice, hasDiscount } from "./utils/pricing";
