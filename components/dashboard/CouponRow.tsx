import type { CouponDTO } from "@/lib/coupon-dto";
import { StatusPill } from "./StatusPill";

export function CouponRow({
  coupon,
  onOpenWinner,
}: {
  coupon: CouponDTO;
  onOpenWinner: (coupon: CouponDTO) => void;
}) {
  const clickable = coupon.status === "WINNER";

  return (
    <div
      onClick={clickable ? () => onOpenWinner(coupon) : undefined}
      className={`grid grid-cols-[30px_1fr_auto_auto_16px] gap-4 items-center px-4.5 py-4 border-b border-line last:border-b-0 ${
        clickable ? "cursor-pointer hover:bg-[#FBFAF6]" : ""
      }`}
    >
      <span className="w-2.5 h-2.5 rounded-full border border-line-strong bg-paper justify-self-center" />

      <div>
        <div className="font-mono font-semibold text-[14.5px] tracking-tight">{coupon.couponNumber}</div>
        <div className="text-[12.5px] text-ink-soft mt-0.5">
          Bill {coupon.billNumber} · {coupon.purchaseDateBS ?? "date pending"}
        </div>
      </div>

      <div className="hidden sm:block text-[12.5px] text-ink-faint text-right">
        {coupon.drawLabel ?? "Awaiting draw assignment"}
      </div>

      <StatusPill status={coupon.status} />

      <div className="text-ink-faint text-[13px]">{clickable ? "›" : ""}</div>
    </div>
  );
}
