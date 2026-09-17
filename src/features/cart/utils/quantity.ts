export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

/** Returns true when `value` is a finite number (not NaN / Infinity). */
export function isValidQuantityInput(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Clamp a quantity into [MIN_QUANTITY, MAX_QUANTITY].
 * Returns null when the input is not a valid finite number.
 */
export function clampQuantity(value: unknown): number | null {
  if (!isValidQuantityInput(value)) return null;
  if (value < MIN_QUANTITY) return MIN_QUANTITY;
  if (value > MAX_QUANTITY) return MAX_QUANTITY;
  return Math.floor(value);
}

/**
 * Normalize a requested add/update quantity.
 * - Invalid → null (caller should no-op)
 * - 0 → 0 (caller may remove)
 * - Otherwise clamp to [1, 99]
 */
export function normalizeQuantity(value: unknown): number | null {
  if (!isValidQuantityInput(value)) return null;
  if (value === 0) return 0;
  if (value < 0) return null;
  return clampQuantity(value);
}
