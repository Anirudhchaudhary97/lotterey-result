"use client";

import { useMemo, useState } from "react";
import type { CouponDTO } from "@/lib/coupon-dto";
import { CouponRow } from "./CouponRow";
import { WinnerModal } from "./WinnerModal";
import { AddCouponDialog } from "./AddCouponDialog";
import { EditCouponDialog } from "./EditCouponDialog";
import { DeleteCouponDialog } from "./DeleteCouponDialog";

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
  const [selectedWinner, setSelectedWinner] = useState<CouponDTO | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<CouponDTO | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<CouponDTO | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchesSearch =
        !term ||
        c.couponNumber.toLowerCase().includes(term) ||
        (c.billNumber && c.billNumber.toLowerCase().includes(term));
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
        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-[#FAF9F5] border border-[#C9C4B3] rounded-lg px-3.5 py-2.5">
          <span className="font-mono text-[#8A8E99] text-xs">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by coupon or bill number…"
            className="border-none outline-none bg-transparent text-sm w-full font-mono placeholder:font-sans"
          />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setStatusFilter(chip.value)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors cursor-pointer ${
                statusFilter === chip.value
                  ? "bg-[#16181F] text-white border-[#16181F]"
                  : "bg-white text-[#565B66] border-[#C9C4B3] hover:border-[#8C8F99]"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-[#565B66] cursor-pointer select-none font-medium">
          Group by draw
          <span
            onClick={() => setGroupByDraw((v) => !v)}
            className={`w-[34px] h-[19px] rounded-full relative transition-colors ${
              groupByDraw ? "bg-[#1E3A5F]" : "bg-[#C9C4B3]"
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
          <div key={label} className="mb-4">
            <div className="flex justify-between items-baseline pt-4 pb-2 px-1 font-mono text-xs text-[#565B66] uppercase tracking-wide">
              <span className="font-display normal-case tracking-normal text-sm font-bold text-[#16181F]">{label}</span>
              <span>
                {items.length} coupon{items.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="border border-[#C9C4B3] rounded-xl overflow-hidden bg-white shadow-sm">
              {items.map((c) => (
                <CouponRow
                  key={c.id}
                  coupon={c}
                  onOpenWinner={setSelectedWinner}
                  onEdit={setEditingCoupon}
                  onDelete={setDeletingCoupon}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="border border-[#C9C4B3] rounded-xl overflow-hidden bg-white shadow-sm">
          {filtered.map((c) => (
            <CouponRow
              key={c.id}
              coupon={c}
              onOpenWinner={setSelectedWinner}
              onEdit={setEditingCoupon}
              onDelete={setDeletingCoupon}
            />
          ))}
        </div>
      )}

      {selectedWinner && <WinnerModal coupon={selectedWinner} onClose={() => setSelectedWinner(null)} />}
      {editingCoupon && <EditCouponDialog coupon={editingCoupon} onClose={() => setEditingCoupon(null)} />}
      {deletingCoupon && <DeleteCouponDialog coupon={deletingCoupon} onClose={() => setDeletingCoupon(null)} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-5 border border-dashed border-[#C9C4B3] rounded-xl bg-white">
      <div className="font-mono text-3xl mb-3">🎟</div>
      <h3 className="font-display text-base font-bold mb-1">No coupons match this view</h3>
      <p className="text-[#565B66] text-xs sm:text-sm mb-4">
        Try a different filter, or add your coupon to start tracking.
      </p>
      <AddCouponDialog />
    </div>
  );
}
