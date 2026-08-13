export interface DrawEligibility {
  id: string;
  eligibleFrom: Date;
  eligibleTo: Date;
}

/**
 * Assigns a coupon to a draw if its purchase date falls within eligibleFrom and eligibleTo.
 */
export function assignDraw(
  coupon: { purchaseDate: Date },
  draws: DrawEligibility[]
): string | null {
  const pDate = new Date(coupon.purchaseDate);
  const matched = draws.find(
    (d) => pDate >= new Date(d.eligibleFrom) && pDate <= new Date(d.eligibleTo)
  );
  return matched ? matched.id : null;
}
