"use client";

import type { CouponDTO } from "@/lib/coupon-dto";
import { StatusPill } from "./StatusPill";
import { Pencil, Trash2 } from "lucide-react";

export function CouponRow({
  coupon,
  onOpenWinner,
  onEdit,
  onDelete,
}: {
  coupon: CouponDTO;
  onOpenWinner: (coupon: CouponDTO) => void;
  onEdit: (coupon: CouponDTO) => void;
  onDelete: (coupon: CouponDTO) => void;
}) {
  const clickable = coupon.status === "WINNER";

  return (
    <div
      className={`grid grid-cols-[24px_1fr_auto_auto_auto] gap-3.5 items-center px-4 py-3.5 border-b border-[#E2DED2] last:border-b-0 hover:bg-[#FBFAF6] transition-colors`}
    >
      <span className="w-2.5 h-2.5 rounded-full border border-[#C9C4B3] bg-[#FAF9F5] justify-self-center" />

      <div
        onClick={clickable ? () => onOpenWinner(coupon) : undefined}
        className={clickable ? "cursor-pointer" : ""}
      >
        <div className="font-mono font-semibold text-sm tracking-tight text-[#16181F] flex items-center gap-2">
          {coupon.couponNumber}
          {clickable && <span className="text-xs text-[#B08A28] font-sans font-bold">★ Winner!</span>}
        </div>
        <div className="text-xs text-[#565B66] mt-0.5 font-mono">
          {coupon.billNumber ? `Bill ${coupon.billNumber}` : "Bill N/A"} · {coupon.purchaseDateBS ?? "date pending"}
        </div>
      </div>

      <div className="hidden sm:block text-xs text-[#8A8E99] font-mono text-right">
        {coupon.drawLabel ?? "Awaiting draw assignment"}
      </div>

      <div onClick={clickable ? () => onOpenWinner(coupon) : undefined} className={clickable ? "cursor-pointer" : ""}>
        <StatusPill status={coupon.status} />
      </div>

      {/* Action Buttons: Edit & Delete */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Edit Coupon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(coupon);
          }}
          className="p-1.5 text-[#565B66] hover:text-[#16181F] hover:bg-[#E2DED2]/50 rounded-md transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          title="Delete Coupon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(coupon);
          }}
          className="p-1.5 text-[#A8241E] hover:text-white hover:bg-[#A8241E] rounded-md transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
