"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { couponFormSchema } from "@/lib/validators/coupon";
import { toBsDisplay } from "@/lib/bs-date";
import { normalizeCouponNumber } from "@/lib/ird/normalize";
import { assignDraw } from "@/lib/matching";

export interface CouponFormState {
  error?: string;
  fieldErrors?: Partial<Record<"couponNumber" | "billNumber" | "purchaseDate", string>>;
}
export type AddCouponState = CouponFormState;

/**
 * Creates a coupon for the current user, assigns it to a draw if its purchase
 * date already falls inside a known eligibility window.
 */
export async function createCouponAction(
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  const userId = await getCurrentUserId();

  const parsed = couponFormSchema.safeParse({
    couponNumber: formData.get("couponNumber"),
    billNumber: formData.get("billNumber") || "",
    purchaseDate: formData.get("purchaseDate"),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<CouponFormState["fieldErrors"]> = {};
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

  const draws = await prisma.draw.findMany({
    select: { id: true, eligibleFrom: true, eligibleTo: true },
  });
  const drawId = assignDraw({ purchaseDate }, draws);

  try {
    await prisma.coupon.create({
      data: {
        userId,
        couponNumber: normalizedCoupon,
        billNumber: billNumber ? billNumber.trim() : "",
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
        error: "You've already saved this coupon number.",
      };
    }
    console.error("createCouponAction failed:", err);
    return { error: "Something went wrong saving that coupon. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/coupons");
  return {};
}

/**
 * Updates an existing coupon for the current user.
 */
export async function updateCouponAction(
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  const userId = await getCurrentUserId();
  const couponId = formData.get("couponId") as string;

  if (!couponId) {
    return { error: "Missing coupon identifier." };
  }

  const parsed = couponFormSchema.safeParse({
    couponNumber: formData.get("couponNumber"),
    billNumber: formData.get("billNumber") || "",
    purchaseDate: formData.get("purchaseDate"),
  });

  if (!parsed.success) {
    const fieldErrors: NonNullable<CouponFormState["fieldErrors"]> = {};
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

  const draws = await prisma.draw.findMany({
    select: { id: true, eligibleFrom: true, eligibleTo: true },
  });
  const drawId = assignDraw({ purchaseDate }, draws);

  try {
    await prisma.coupon.updateMany({
      where: { id: couponId, userId },
      data: {
        couponNumber: normalizedCoupon,
        billNumber: billNumber ? billNumber.trim() : "",
        purchaseDate,
        purchaseDateBS: toBsDisplay(purchaseDate),
        drawId: drawId ?? undefined,
        status: drawId ? "CHECKED" : "PENDING",
      },
    });
  } catch (err) {
    console.error("updateCouponAction failed:", err);
    return { error: "Failed to update coupon. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/coupons");
  return {};
}

/**
 * Deletes a coupon belonging to the current user.
 */
export async function deleteCouponAction(couponId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getCurrentUserId();

  try {
    const deleted = await prisma.coupon.deleteMany({
      where: { id: couponId, userId },
    });

    if (deleted.count === 0) {
      return { success: false, error: "Coupon not found or access denied." };
    }
  } catch (err) {
    console.error("deleteCouponAction failed:", err);
    return { success: false, error: "Failed to delete coupon." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/coupons");
  return { success: true };
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
