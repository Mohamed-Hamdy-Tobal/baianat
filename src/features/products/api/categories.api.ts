import "server-only";

import { CATALOGUE_FETCH_OPTIONS, request } from "@/lib/api/http";

import { toCategory } from "../mappers/category.mapper";
import { categoryListSchema } from "../schemas/category.schema";
import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const values = await request("/products/categories", {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: categoryListSchema,
  });

  return values.map(toCategory);
}
