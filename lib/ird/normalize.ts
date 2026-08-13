/**
 * Normalizes a coupon number string by removing spaces and converting to uppercase.
 */
export function normalizeCouponNumber(raw: string): string {
  return raw.trim().replace(/\s+/g, "").toUpperCase();
}
