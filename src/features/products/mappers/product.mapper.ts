import type { ProductDetailsDto, ProductSummaryDto } from "../schemas/product.schema";
import type { ProductDetails, ProductReview, ProductSummary } from "../types/product";
import { buildProductSlug } from "../utils/product-slug";

import { toCategory } from "./category.mapper";

function reviewCount(dto: { reviews?: unknown[] }): number {
  return dto.reviews?.length ?? 0;
}

export function toProductSummary(dto: ProductSummaryDto): ProductSummary {
  return {
    id: dto.id,
    slug: buildProductSlug(dto.title, dto.id),
    title: dto.title,
    description: dto.description,
    price: dto.price,
    discountPercentage: dto.discountPercentage ?? 0,
    category: toCategory(dto.category),
    image: dto.thumbnail,
    brand: dto.brand ?? null,
    stock: dto.stock ?? 0,
    availabilityStatus: dto.availabilityStatus ?? null,
    rating: {
      rate: dto.rating,
      count: reviewCount(dto),
    },
  };
}

export function toProductSummaries(dtos: ProductSummaryDto[]): ProductSummary[] {
  return dtos.map(toProductSummary);
}

export function toProductDetails(dto: ProductDetailsDto): ProductDetails {
  const summary = toProductSummary(dto);
  const images = dto.images?.length ? dto.images : [dto.thumbnail];
  const reviews: ProductReview[] = (dto.reviews ?? []).map((review) => ({
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    reviewerName: review.reviewerName,
  }));

  return {
    ...summary,
    rating: {
      rate: dto.rating,
      count: reviews.length,
    },
    images,
    sku: dto.sku ?? null,
    tags: dto.tags ?? [],
    weight: dto.weight ?? null,
    dimensions: dto.dimensions
      ? {
          width: dto.dimensions.width,
          height: dto.dimensions.height,
          depth: dto.dimensions.depth,
        }
      : null,
    warrantyInformation: dto.warrantyInformation ?? null,
    shippingInformation: dto.shippingInformation ?? null,
    returnPolicy: dto.returnPolicy ?? null,
    minimumOrderQuantity: dto.minimumOrderQuantity ?? null,
    barcode: dto.meta?.barcode ?? null,
    reviews,
    updatedAt: dto.meta?.updatedAt ?? null,
  };
}

/** @deprecated Prefer toProductSummary / toProductDetails */
export function toProduct(dto: ProductDetailsDto | ProductSummaryDto): ProductSummary {
  return toProductSummary(dto);
}

export function toProducts(dtos: ProductSummaryDto[]): ProductSummary[] {
  return toProductSummaries(dtos);
}
