import type { Coupon, Draw, Winner } from "@prisma/client";

export type CouponWithRelations = Coupon & {
  draw: Draw | null;
  winner: (Winner & { draw: Draw }) | null;
};

export interface CouponDTO {
  id: string;
  couponNumber: string;
  billNumber: string;
  purchaseDate: string;
  purchaseDateISO: string;
  purchaseDateBS: string | null;
  billPhotoUrl: string | null;
  status: "PENDING" | "CHECKED" | "WINNER";
  drawLabel: string | null;
  winnerRank: number | null;
  draw: {
    titleEn: string;
    categoryTitleEn: string;
    claimDeadline: string;
    claimOpen: boolean;
  } | null;
  winner: null | {
    rank: number;
    category: string;
    claimDeadlineISO: string;
    claimOpen: boolean;
  };
}

/** Converts a Prisma Coupon (with draw + winner.draw included) into the flat shape the UI renders. */
export function toCouponDTO(c: CouponWithRelations): CouponDTO {
  const effectiveDraw = c.winner?.draw ?? c.draw;

  return {
    id: c.id,
    couponNumber: c.couponNumber,
    billNumber: c.billNumber,
    purchaseDate: c.purchaseDate.toISOString().split("T")[0],
    purchaseDateISO: c.purchaseDate.toISOString(),
    purchaseDateBS: c.purchaseDateBS,
    billPhotoUrl: c.billPhotoUrl,
    status: c.status as "PENDING" | "CHECKED" | "WINNER",
    drawLabel: effectiveDraw ? effectiveDraw.titleEn : null,
    winnerRank: c.winner ? c.winner.rank : null,
    draw: effectiveDraw
      ? {
          titleEn: effectiveDraw.titleEn,
          categoryTitleEn: effectiveDraw.categoryTitleEn,
          claimDeadline: effectiveDraw.claimDeadline.toISOString(),
          claimOpen: effectiveDraw.claimOpen,
        }
      : null,
    winner: c.winner
      ? {
          rank: c.winner.rank,
          category: c.winner.draw.categoryTitleEn,
          claimDeadlineISO: c.winner.draw.claimDeadline.toISOString(),
          claimOpen: c.winner.draw.claimOpen,
        }
      : null,
  };
}
