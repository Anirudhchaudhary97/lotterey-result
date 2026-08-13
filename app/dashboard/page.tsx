import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCouponDTO } from "@/lib/coupon-dto";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { DrawBanner, type DrawBannerData } from "@/components/dashboard/DrawBanner";
import { CouponList } from "@/components/dashboard/CouponList";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();

  const [rawCoupons, currentDraw] = await Promise.all([
    prisma.coupon.findMany({
      where: { userId },
      include: { draw: true, winner: { include: { draw: true } } },
      orderBy: { createdAt: "desc" },
    }),
    // "Current" draw = the most recently published one; falls back to the
    // most recently synced draw if none are published yet.
    prisma.draw.findFirst({ orderBy: { publishedAt: "desc" } }),
  ]);

  const coupons = rawCoupons.map(toCouponDTO);

  const drawBanner: DrawBannerData | null = currentDraw
    ? {
        titleEn: currentDraw.titleEn,
        eligibleFrom: formatShortDate(currentDraw.eligibleFrom),
        eligibleTo: formatShortDate(currentDraw.eligibleTo),
        isPublished: currentDraw.publishedAt <= new Date(),
      }
    : null;

  return (
    <div>
      <div className="flex justify-between items-end mb-6.5 flex-wrap gap-3.5">
        <div>
          <h1 className="font-display text-[25px] font-semibold tracking-tight">Your coupons</h1>
          <p className="text-ink-soft text-[13.5px] mt-1">
            Automatically checked against every published IRD draw.
          </p>
        </div>
      </div>

      <StatsRow coupons={coupons} />
      <DrawBanner draw={drawBanner} />
      <CouponList coupons={coupons} />
    </div>
  );
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
