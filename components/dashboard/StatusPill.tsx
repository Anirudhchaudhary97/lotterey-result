import type { CouponDTO } from "@/lib/coupon-dto";

const STYLES: Record<CouponDTO["status"], string> = {
  PENDING: "bg-seal-blue-soft text-seal-blue",
  CHECKED: "bg-[#EDEDE8] text-ink-soft",
  WINNER: "bg-gold-soft text-[#7A5E15]",
};

const DOT: Record<CouponDTO["status"], string> = {
  PENDING: "bg-seal-blue",
  CHECKED: "bg-ink-soft",
  WINNER: "bg-gold",
};

const LABEL: Record<CouponDTO["status"], string> = {
  PENDING: "PENDING",
  CHECKED: "NOT SELECTED",
  WINNER: "WINNER",
};

export function StatusPill({ status }: { status: CouponDTO["status"] }) {
  return (
    <span
      className={`font-mono text-[11.5px] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap ${STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT[status]}`} />
      {LABEL[status]}
    </span>
  );
}
