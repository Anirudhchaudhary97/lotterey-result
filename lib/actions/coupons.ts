"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { couponFormSchema } from "@/lib/validators/coupon";
import { toBsDisplay } from "@/lib/bs-date";
import { normalizeCouponNumber } from "@/lib/ird/normalize";
import { assignDraw } from "@/lib/matching";

export interface AddCouponState {
  error?: string;
  fieldErrors?: Partial<Record<"couponNumber" | "billNumber" | "purchaseDate", string>>;
}

/**
 * Creates a coupon for the current user, assigns it to a draw if its purchase
 * date already falls inside a known eligibility window, and revalidates the
 * dashboard so the new row shows up without a client-side refetch.
 */
export async function createCouponAction(
  _prevState: AddCouponState,
  formData: FormData
): Promise<AddCouponState> {
  const userId = await getCurrentUserId();

  const parsed = couponFormSchema.safeParse({
    couponNumber: formData.get("couponNumber"),
    billNumber: formData.get("billNumber"),
    purchaseDate: formData.get("purchaseDate"),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<AddCouponState["fieldErrors"]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "couponNumber" || key === "billNumber" || key === "purchaseDate") {
        fieldErrors[key] = issue.message;
      }
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const { couponNumber, billNumber, purchaseDate } = parsed.data;
  const normalizedCoupon = normalizeCouponNumber(couponNumber);

  // Try to place the coupon into a known draw window immediately.
  const draws = await prisma.draw.findMany({
    select: { id: true, eligibleFrom: true, eligibleTo: true },
  });
  const drawId = assignDraw({ purchaseDate }, draws);

  try {
    await prisma.coupon.create({
      data: {
        userId,
        couponNumber: normalizedCoupon,
        billNumber: billNumber.trim(),
        purchaseDate,
        purchaseDateBS: toBsDisplay(purchaseDate),
        billPhotoUrl: null,
        drawId: drawId ?? undefined,
        status: drawId ? "CHECKED" : "PENDING",
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        error: "You've already saved this coupon and bill number combination.",
      };
    }
    console.error("createCouponAction failed:", err);
    return { error: "Something went wrong saving that coupon. Please try again." };
  }

  revalidatePath("/dashboard");
  return {};
}

/** Fetches all coupons for the current user, most recent first. */
export async function getUserCoupons() {
  const userId = await getCurrentUserId();
  return prisma.coupon.findMany({
    where: { userId },
    include: { draw: true, winner: { include: { draw: true } } },
    orderBy: { createdAt: "desc" },
  });
}
