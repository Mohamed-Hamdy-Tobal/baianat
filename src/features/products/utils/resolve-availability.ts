/**
 * Localized availability label from stock quantity.
 * Avoids exposing raw DummyJSON English strings (e.g. "In Stock") on /ar.
 */
export function resolveAvailabilityKey(stock: number): "inStock" | "outOfStock" {
  return stock > 0 ? "inStock" : "outOfStock";
}
