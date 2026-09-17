import { z } from "zod";

export const categoryDtoSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  url: z.string(),
});

export const categoryListSchema = z.array(categoryDtoSchema);

/** Lightweight DummyJSON category products envelope for preview cards. */
export const categoryPreviewPageSchema = z.object({
  products: z.array(
    z.object({
      thumbnail: z.string().min(1).optional(),
      title: z.string().optional(),
    }),
  ),
  total: z.number(),
  skip: z.number().optional(),
  limit: z.number().optional(),
});

export type CategoryDto = z.infer<typeof categoryDtoSchema>;
export type CategoryListDto = z.infer<typeof categoryListSchema>;
export type CategoryPreviewPageDto = z.infer<typeof categoryPreviewPageSchema>;

export const CATEGORY_PREVIEW_SELECT = "thumbnail,title";
