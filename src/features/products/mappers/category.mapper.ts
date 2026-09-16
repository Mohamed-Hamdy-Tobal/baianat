import type { Category } from "../types/category";
import { normalizeCategory } from "../utils/normalize-category";

export function toCategory(apiValue: string): Category {
  return normalizeCategory(apiValue);
}
