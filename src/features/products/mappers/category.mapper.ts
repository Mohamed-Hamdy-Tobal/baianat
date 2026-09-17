import type { CategoryDto } from "../schemas/category.schema";
import type { Category } from "../types/category";
import { normalizeCategory, normalizeCategoryDto } from "../utils/normalize-category";

export function toCategory(apiValue: string): Category {
  return normalizeCategory(apiValue);
}

export function toCategoryFromDto(dto: CategoryDto): Category {
  return normalizeCategoryDto(dto);
}
