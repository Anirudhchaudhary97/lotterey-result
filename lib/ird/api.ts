import { normalizeCouponNumber } from "./normalize";

export interface IRDWinner {
  winner_rank: number;
  prize_fiscal_year_code: string;
  prize_coupon_number: string;
}

export interface IRDDraw {
  draw_id: string;
  category_id?: string;
  category_title_en: string;
  category_title_ne?: string;
  draw_type?: string;
  title_en: string;
  title_ne?: string;
  eligible_from: string;
  eligible_to: string;
  published_at: string;
  claim_deadline: string;
  claim_open: boolean;
  winners: IRDWinner[];
}

export interface IRDWinnersAPIResponse {
  limit: number;
  offset: number;
  total_draws: number;
  has_more: boolean;
  fiscal_years?: unknown[];
  categories?: unknown[];
  draws: IRDDraw[];
}

/**
 * Fetches published winner draws from the official IRD endpoint.
 * Robust handling without hardcoded security cookies.
 */
export async function fetchIRDWinners(
  endpointUrl: string = "https://prize.ird.gov.np/api/v1/public/winners"
): Promise<IRDWinnersAPIResponse | null> {
  try {
    const res = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 900 }, // cache for 15 minutes
    });

    if (!res.ok) {
      console.warn(`IRD API returned status ${res.status}`);
      return null;
    }

    const data: IRDWinnersAPIResponse = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch IRD winners:", err);
    return null;
  }
}

/**
 * Extracts a flattened normalized set of winner coupon numbers across all draws.
 */
export function extractWinnerCoupons(response: IRDWinnersAPIResponse): Map<string, { winner: IRDWinner; draw: IRDDraw }> {
  const map = new Map<string, { winner: IRDWinner; draw: IRDDraw }>();

  if (!response.draws) return map;

  for (const draw of response.draws) {
    for (const winner of draw.winners) {
      const normalized = normalizeCouponNumber(winner.prize_coupon_number);
      map.set(normalized, { winner, draw });
    }
  }

  return map;
}
