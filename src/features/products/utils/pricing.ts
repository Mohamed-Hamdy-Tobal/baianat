export function hasDiscount(discountPercentage: number): boolean {
  return discountPercentage > 0;
}

export function discountedPrice(price: number, discountPercentage: number): number {
  if (!hasDiscount(discountPercentage)) return price;
  return Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
}
