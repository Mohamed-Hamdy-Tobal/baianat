import { z } from "zod";

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string().min(1),
  image: z.string(),
  rating: z
    .object({
      rate: z.number(),
      count: z.number(),
    })
    .optional(),
});

export const productsSchema = z.array(productSchema);

export type ProductDto = z.infer<typeof productSchema>;
