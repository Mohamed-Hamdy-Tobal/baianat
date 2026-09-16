import "server-only";

import { CATALOGUE_FETCH_OPTIONS, request } from "@/lib/api/http";

import { toProduct, toProducts } from "../mappers/product.mapper";
import { productSchema, productsSchema } from "../schemas/product.schema";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const dtos = await request("/products", {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productsSchema,
  });

  return toProducts(dtos);
}

export async function getProductById(id: number): Promise<Product> {
  const dto = await request(`/products/${id}`, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productSchema,
  });

  return toProduct(dto);
}

export async function getProductsByCategory(apiValue: string): Promise<Product[]> {
  const encoded = encodeURIComponent(apiValue);
  const dtos = await request(`/products/category/${encoded}`, {
    ...CATALOGUE_FETCH_OPTIONS,
    schema: productsSchema,
  });

  return toProducts(dtos);
}
