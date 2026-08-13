import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCouponDTO } from "@/lib/coupon-dto";
import { CouponList } from "@/components/dashboard/CouponList";
import { AddCouponDialog } from "@/components/dashboard/AddCouponDialog";

export default async function CouponsPage() {
  const userId = await getCurrentUserId();

  const rawCoupons = await prisma.coupon.findMany({
    where: { userId },
    include: { draw: true, winner: { include: { draw: true } } },
    orderBy: { createdAt: "desc" },
  });

  const coupons = rawCoupons.map(toCouponDTO);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#E2DED2] pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#16181F]">Coupons Management</h1>
          <p className="text-[#565B66] text-xs sm:text-sm mt-1">
            Manage your registered bill coupons and track their IRD draw status.
          </p>
        </div>
        <AddCouponDialog />
      </div>

      <CouponList coupons={coupons} />
    </div>
  );
}
