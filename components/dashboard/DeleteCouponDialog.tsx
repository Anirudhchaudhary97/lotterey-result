"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { deleteCouponAction } from "@/lib/actions/coupons";
import type { CouponDTO } from "@/lib/coupon-dto";
import { Trash2 } from "lucide-react";

export function DeleteCouponDialog({
  coupon,
  onClose,
}: {
  coupon: CouponDTO;
  onClose: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await deleteCouponAction(coupon.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success(`Coupon ${coupon.couponNumber} deleted successfully!`);
      onClose();
    } else {
      toast.error(res.error || "Failed to delete coupon.");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100] p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-[400px] shadow-2xl border border-[#C9C4B3] p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#F4E2DE] text-[#A8241E] flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-display font-bold text-lg text-[#16181F]">Delete Coupon?</h3>
          <p className="text-xs text-[#565B66] mt-1">
            Are you sure you want to delete coupon <strong className="font-mono text-[#16181F]">{coupon.couponNumber}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#C9C4B3] text-xs font-semibold rounded-md hover:bg-[#FAF9F5]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-4 py-2 bg-[#A8241E] text-white text-xs font-semibold rounded-md hover:bg-[#931e19] disabled:opacity-60"
          >
            {isDeleting ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
