import { z } from "zod";

export const productReviewDtoSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  date: z.string(),
  reviewerName: z.string(),
  reviewerEmail: z.string().optional(),
});

export const productDimensionsDtoSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

/** Fields needed for product cards / listing. */
export const productSummaryDtoSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string().min(1),
  price: z.number(),
  discountPercentage: z.number().optional().default(0),
  rating: z.number(),
  stock: z.number().optional().default(0),
  brand: z.string().nullish(),
  availabilityStatus: z.string().nullish(),
  thumbnail: z.string().min(1),
  reviews: z.array(z.unknown()).optional(),
});

export const productDetailsDtoSchema = productSummaryDtoSchema.extend({
  images: z.array(z.string()).optional().default([]),
  sku: z.string().nullish(),
  tags: z.array(z.string()).optional().default([]),
  weight: z.number().nullish(),
  dimensions: productDimensionsDtoSchema.nullish(),
  warrantyInformation: z.string().nullish(),
  shippingInformation: z.string().nullish(),
  returnPolicy: z.string().nullish(),
  minimumOrderQuantity: z.number().nullish(),
  meta: z
    .object({
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      barcode: z.string().optional(),
    })
    .optional(),
  reviews: z.array(productReviewDtoSchema).optional().default([]),
});

export const productsPageResponseSchema = z.object({
  products: z.array(productSummaryDtoSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const productMetaIndexResponseSchema = z.object({
  products: z.array(
    z.object({
      id: z.number(),
      meta: z.object({
        updatedAt: z.string(),
      }),
    }),
  ),
});

export const productStaticParamsResponseSchema = z.object({
  products: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
    }),
  ),
});

/** @deprecated Use productSummaryDtoSchema / productDetailsDtoSchema */
export const productSchema = productDetailsDtoSchema;
export const productsResponseSchema = z.object({
  products: z.array(productSummaryDtoSchema),
});

export type ProductSummaryDto = z.infer<typeof productSummaryDtoSchema>;
export type ProductDetailsDto = z.infer<typeof productDetailsDtoSchema>;
export type ProductDto = ProductDetailsDto;
export type ProductsPageResponseDto = z.infer<typeof productsPageResponseSchema>;

export const LISTING_SELECT =
  "id,title,description,category,price,discountPercentage,rating,stock,brand,availabilityStatus,thumbnail,reviews";
