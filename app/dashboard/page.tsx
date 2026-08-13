import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCouponDTO } from "@/lib/coupon-dto";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { DrawBanner, type DrawBannerData } from "@/components/dashboard/DrawBanner";
import { CouponList } from "@/components/dashboard/CouponList";
import { AddCouponDialog } from "@/components/dashboard/AddCouponDialog";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();

  const [rawCoupons, currentDraw] = await Promise.all([
    prisma.coupon.findMany({
      where: { userId },
      include: { draw: true, winner: { include: { draw: true } } },
      orderBy: { createdAt: "desc" },
    }),
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
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#E2DED2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#16181F]">Dashboard Overview</h1>
          <p className="text-[#565B66] text-xs sm:text-sm mt-1">
            Track your coupons automatically checked against official IRD Nepal winner publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddCouponDialog />
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
