import type { ProductDto } from "../schemas/product.schema";
import type { Product } from "../types/product";
import { buildProductSlug } from "../utils/product-slug";

import { toCategory } from "./category.mapper";

export function toProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    slug: buildProductSlug(dto.title, dto.id),
    title: dto.title,
    description: dto.description,
    price: dto.price,
    category: toCategory(dto.category),
    image: dto.image,
    rating: dto.rating ?? { rate: 0, count: 0 },
  };
}

export function toProducts(dtos: ProductDto[]): Product[] {
  return dtos.map(toProduct);
}
