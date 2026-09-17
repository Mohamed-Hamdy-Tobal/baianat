/**
 * Deterministic demo order id: BAY-YYYYMMDD-XXXX
 * Seeded from date + user seed so tests are stable (no Math.random).
 */
export function generateOrderId(createdAt: Date, seed: string): string {
  const year = createdAt.getUTCFullYear();
  const month = String(createdAt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getUTCDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  let hash = 0;
  const material = `${datePart}:${seed}`;
  for (let i = 0; i < material.length; i += 1) {
    hash = (hash * 31 + material.charCodeAt(i)) >>> 0;
  }
  const suffix = String(hash % 10000).padStart(4, "0");

  return `BAY-${datePart}-${suffix}`;
}
