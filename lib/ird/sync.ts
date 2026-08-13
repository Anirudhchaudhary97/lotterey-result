import { prisma } from "@/lib/prisma";
import { fetchIRDWinners, extractWinnerCoupons, type IRDWinnersAPIResponse } from "./api";
import { normalizeCouponNumber } from "./normalize";

export interface SyncResult {
  success: boolean;
  drawsSynced: number;
  winnersSynced: number;
  couponsUpdated: number;
  winnersFound: number;
  error?: string;
}

/**
 * Core IRD Sync & Coupon Matching Engine
 * 1. Fetches official published IRD draws & winners.
 * 2. Saves/updates Draw and Winner records in the database.
 * 3. Assigns coupons to matching draw eligibility windows.
 * 4. Checks user coupons against winner list and marks WINNER / CHECKED.
 */
export async function performIRDSync(apiData?: IRDWinnersAPIResponse): Promise<SyncResult> {
  try {
    const data = apiData ?? (await fetchIRDWinners());
    if (!data || !data.draws) {
      return {
        success: false,
        drawsSynced: 0,
        winnersSynced: 0,
        couponsUpdated: 0,
        winnersFound: 0,
        error: "No IRD data received or endpoint unreachable.",
      };
    }

    let drawsSynced = 0;
    let winnersSynced = 0;
    const winnerCouponMap = extractWinnerCoupons(data);

    for (const drawData of data.draws) {
      const eligibleFrom = new Date(drawData.eligible_from);
      const eligibleTo = new Date(drawData.eligible_to);
      const publishedAt = new Date(drawData.published_at);
      const claimDeadline = new Date(drawData.claim_deadline);

      // Upsert Draw
      const draw = await prisma.draw.upsert({
        where: { irdDrawId: drawData.draw_id },
        update: {
          categoryTitleEn: drawData.category_title_en,
          categoryTitleNe: drawData.category_title_ne ?? null,
          drawType: drawData.draw_type ?? null,
          titleEn: drawData.title_en,
          titleNe: drawData.title_ne ?? null,
          eligibleFrom,
          eligibleTo,
          publishedAt,
          claimDeadline,
          claimOpen: drawData.claim_open,
          syncedAt: new Date(),
        },
        create: {
          irdDrawId: drawData.draw_id,
          categoryId: drawData.category_id ?? null,
          categoryTitleEn: drawData.category_title_en,
          categoryTitleNe: drawData.category_title_ne ?? null,
          drawType: drawData.draw_type ?? null,
          titleEn: drawData.title_en,
          titleNe: drawData.title_ne ?? null,
          eligibleFrom,
          eligibleTo,
          publishedAt,
          claimDeadline,
          claimOpen: drawData.claim_open,
          syncedAt: new Date(),
        },
      });
      drawsSynced++;

      // Upsert Winners for this Draw
      for (const w of drawData.winners) {
        const normalized = normalizeCouponNumber(w.prize_coupon_number);
        
        // Find existing winner or create
        const existingWinner = await prisma.winner.findFirst({
          where: { drawId: draw.id, couponNumber: normalized, rank: w.winner_rank },
        });

        if (!existingWinner) {
          await prisma.winner.create({
            data: {
              drawId: draw.id,
              rank: w.winner_rank,
              fiscalYear: w.prize_fiscal_year_code,
              couponNumber: normalized,
            },
          });
          winnersSynced++;
        }
      }
    }

    // Now Match All Pending/Unchecked User Coupons against Database Draws & Winners
    const userCoupons = await prisma.coupon.findMany({
      include: { draw: true, winner: true },
    });
    const dbDraws = await prisma.draw.findMany();

    let couponsUpdated = 0;
    let winnersFound = 0;

    for (const coupon of userCoupons) {
      const normalizedNumber = normalizeCouponNumber(coupon.couponNumber);
      const pDate = new Date(coupon.purchaseDate);

      // Find matching draw window by eligibility date
      const matchedDraw = dbDraws.find(
        (d) => pDate >= new Date(d.eligibleFrom) && pDate <= new Date(d.eligibleTo)
      );

      // Find matching winner record
      const matchedWinner = await prisma.winner.findFirst({
        where: { couponNumber: normalizedNumber },
        include: { draw: true },
      });

      if (matchedWinner) {
        // User won a prize!
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: {
            status: "WINNER",
            drawId: matchedWinner.drawId,
            winnerId: matchedWinner.id,
          },
        });
        couponsUpdated++;
        winnersFound++;
      } else if (matchedDraw) {
        // Coupon falls into a known draw that has results published
        const isDrawPublished = new Date(matchedDraw.publishedAt) <= new Date();
        const nextStatus = isDrawPublished ? "CHECKED" : "PENDING";
        
        if (coupon.status !== nextStatus || coupon.drawId !== matchedDraw.id) {
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: {
              status: nextStatus,
              drawId: matchedDraw.id,
            },
          });
          couponsUpdated++;
        }
      }
    }

    return {
      success: true,
      drawsSynced,
      winnersSynced,
      couponsUpdated,
      winnersFound,
    };
  } catch (err) {
    console.error("IRDSync Execution Error:", err);
    return {
      success: false,
      drawsSynced: 0,
      winnersSynced: 0,
      couponsUpdated: 0,
      winnersFound: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
