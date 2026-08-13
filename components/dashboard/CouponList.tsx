"use client";

import { useMemo, useState } from "react";
import type { CouponDTO } from "@/lib/coupon-dto";
import { CouponRow } from "./CouponRow";
import { WinnerModal } from "./WinnerModal";
import { AddCouponDialog } from "./AddCouponDialog";

type StatusFilter = "ALL" | CouponDTO["status"];

const CHIPS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Not selected", value: "CHECKED" },
  { label: "Winners", value: "WINNER" },
];

export function CouponList({ coupons }: { coupons: CouponDTO[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [groupByDraw, setGroupByDraw] = useState(false);
  const [selected, setSelected] = useState<CouponDTO | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchesSearch =
        !term || c.couponNumber.toLowerCase().includes(term) || c.billNumber.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [coupons, search, statusFilter]);

  const grouped = useMemo(() => {
    if (!groupByDraw) return null;
    const groups = new Map<string, CouponDTO[]>();
    for (const c of filtered) {
      const key = c.drawLabel ?? "Awaiting draw assignment";
      groups.set(key, [...(groups.get(key) ?? []), c]);
    }
    return groups;
  }, [filtered, groupByDraw]);

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4.5 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-paper-raised border border-line-strong rounded-md px-3.5 py-2.5">
          <span className="font-mono text-ink-faint text-[13px]">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by coupon or bill number…"
            className="border-none outline-none bg-transparent text-[13.5px] w-full"
          />
        </div>

        <div className="flex gap-1.5">
          {CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setStatusFilter(chip.value)}
              className={`text-[12.5px] font-semibold px-3.5 py-2 rounded-full border ${
                statusFilter === chip.value
                  ? "bg-ink text-white border-ink"
                  : "bg-paper-raised text-ink-soft border-line-strong"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-[12.5px] text-ink-soft cursor-pointer select-none">
          Group by draw
          <span
            onClick={() => setGroupByDraw((v) => !v)}
            className={`w-[34px] h-[19px] rounded-full relative transition-colors ${
              groupByDraw ? "bg-seal-blue" : "bg-line-strong"
            }`}
          >
            <span
              className={`absolute w-[15px] h-[15px] rounded-full bg-white top-[2px] left-[2px] transition-transform ${
                groupByDraw ? "translate-x-[15px]" : ""
              }`}
            />
          </span>
        </label>

        <AddCouponDialog />
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : grouped ? (
        Array.from(grouped.entries()).map(([label, items]) => (
          <div key={label}>
            <div className="flex justify-between items-baseline pt-5 pb-2.5 px-1 font-mono text-xs text-ink-soft uppercase tracking-wide">
              <span className="font-display normal-case tracking-normal text-[14.5px] text-ink">{label}</span>
              <span>
                {items.length} coupon{items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="border border-line rounded-lg overflow-hidden bg-paper-raised">
              {items.map((c) => (
                <CouponRow key={c.id} coupon={c} onOpenWinner={setSelected} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="border border-line rounded-lg overflow-hidden bg-paper-raised">
          {filtered.map((c) => (
            <CouponRow key={c.id} coupon={c} onOpenWinner={setSelected} />
          ))}
        </div>
      )}

      {selected && <WinnerModal coupon={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-5 border border-dashed border-line-strong rounded-lg">
      <div className="font-mono text-[26px] text-ink-faint mb-3">🎟</div>
      <h3 className="font-display text-base mb-1.5">No coupons match this view</h3>
      <p className="text-ink-soft text-[13.5px] mb-4">
        Try a different filter, or add your first coupon to start tracking.
      </p>
      <AddCouponDialog />
    </div>
  );
}
