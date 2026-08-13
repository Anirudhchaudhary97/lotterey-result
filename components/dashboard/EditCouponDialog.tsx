"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateCouponAction, type CouponFormState } from "@/lib/actions/coupons";
import type { CouponDTO } from "@/lib/coupon-dto";
import { toBsDisplay } from "@/lib/bs-date";

const initialState: CouponFormState = {};

export function EditCouponDialog({
  coupon,
  onClose,
}: {
  coupon: CouponDTO;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateCouponAction, initialState);
  const [couponNum, setCouponNum] = useState(coupon.couponNumber);
  const [billNum, setBillNum] = useState(coupon.billNumber || "");
  const [dateValue, setDateValue] = useState(() => {
    return coupon.purchaseDate
      ? new Date(coupon.purchaseDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
  });

  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (!state.error && !state.fieldErrors) {
        toast.success("Coupon updated successfully!");
        onClose();
      } else if (state.error) {
        toast.error(state.error);
      }
    }
    wasPending.current = pending;
  }, [pending, state, onClose]);

  const bsHint = (() => {
    try {
      return toBsDisplay(new Date(dateValue));
    } catch {
      return null;
    }
  })();

  return (
    <div
      className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100] p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl w-full max-w-[460px] max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C9C4B3]">
        <div className="flex justify-between items-center px-5.5 py-4 border-b border-[#E2DED2]">
          <h2 className="font-display text-base font-bold text-[#16181F]">Edit Coupon</h2>
          <button onClick={onClose} className="text-[#8A8E99] hover:text-[#16181F] text-lg font-mono">
            ✕
          </button>
        </div>

        <form action={formAction} className="p-5.5 space-y-4">
          <input type="hidden" name="couponId" value={coupon.id} />

          {state.error && (
            <p className="text-xs text-[#A8241E] bg-[#F4E2DE] border border-[#A8241E]/30 rounded-md px-3 py-2">
              {state.error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#16181F]">
              Coupon number <span className="text-[#A8241E]">*</span>
            </label>
            <input
              name="couponNumber"
              value={couponNum}
              onChange={(e) => setCouponNum(e.target.value)}
              required
              className="font-mono w-full px-3 py-2 border border-[#C9C4B3] rounded-md text-sm outline-none focus:border-[#1E3A5F]"
            />
            {state.fieldErrors?.couponNumber && (
              <p className="text-xs text-[#A8241E] mt-1 font-mono">{state.fieldErrors.couponNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#16181F]">
              Bill number (optional)
            </label>
            <input
              name="billNumber"
              value={billNum}
              onChange={(e) => setBillNum(e.target.value)}
              placeholder="Optional bill number"
              className="font-mono w-full px-3 py-2 border border-[#C9C4B3] rounded-md text-sm outline-none focus:border-[#1E3A5F]"
            />
            {state.fieldErrors?.billNumber && (
              <p className="text-xs text-[#A8241E] mt-1 font-mono">{state.fieldErrors.billNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#16181F]">
              Purchase date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="font-mono w-full px-3 py-2 border border-[#C9C4B3] rounded-md text-sm outline-none focus:border-[#1E3A5F]"
            />
            {bsHint && (
              <p className="font-mono text-xs text-[#565B66] mt-1">
                ≈ {bsHint} BS (calculated automatically)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E2DED2]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#C9C4B3] text-sm font-semibold rounded-md hover:bg-[#FAF9F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 bg-[#16181F] text-white text-sm font-semibold rounded-md hover:bg-[#2b2e38] disabled:opacity-60"
            >
              {pending ? "Updating…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
