import { z } from "zod";

export const categoryListSchema = z.array(z.string().min(1));

export type CategoryListDto = z.infer<typeof categoryListSchema>;
