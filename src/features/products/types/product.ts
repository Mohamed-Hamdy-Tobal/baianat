import type { Category } from "./category";

/** Listing / card product (catalogue discovery). */
export type ProductSummary = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  category: Category;
  image: string;
  brand: string | null;
  stock: number;
  availabilityStatus: string | null;
  rating: {
    rate: number;
    count: number;
  };
};

/** @deprecated Prefer ProductSummary — kept as alias for gradual migration. */
export type Product = ProductSummary;

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

export type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type ProductDetails = ProductSummary & {
  images: string[];
  sku: string | null;
  tags: string[];
  weight: number | null;
  dimensions: ProductDimensions | null;
  warrantyInformation: string | null;
  shippingInformation: string | null;
  returnPolicy: string | null;
  minimumOrderQuantity: number | null;
  barcode: string | null;
  reviews: ProductReview[];
  updatedAt: string | null;
};
