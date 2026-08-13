import type { CouponDTO } from "@/lib/coupon-dto";

export function StatsRow({ coupons }: { coupons: CouponDTO[] }) {
  const total = coupons.length;
  const checked = coupons.filter((c) => c.status !== "PENDING").length;
  const winners = coupons.filter((c) => c.status === "WINNER").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line rounded-lg overflow-hidden mb-6">
      <Stat num={total} label="Total coupons" />
      <Stat num={checked} label="Checked" />
      <Stat num={winners} label="🎉 Winners" accent />
    </div>
  );
}

function Stat({ num, label, accent }: { num: number; label: string; accent?: boolean }) {
  return (
    <div className="bg-paper-raised px-6 py-5">
      <div className={`font-display text-3xl font-bold tracking-tight ${accent ? "text-stamp-red" : "text-ink"}`}>
        {num}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft mt-1">{label}</div>
    </div>
  );
}
