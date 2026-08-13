"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { createCouponAction, type CouponFormState } from "@/lib/actions/coupons";
import { toBsDisplay } from "@/lib/bs-date";

const initialState: CouponFormState = {};

export function AddCouponDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createCouponAction, initialState);
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  // Close + reset once a submit finishes with no error (success case).
  useEffect(() => {
    if (wasPending.current && !pending) {
      if (!state.error && !state.fieldErrors) {
        toast.success("Coupon added successfully!");
        queueMicrotask(() => {
          setOpen(false);
          setPhotoPreview(null);
        });
        formRef.current?.reset();
      } else if (state.error) {
        toast.error(state.error);
      }
    }
    wasPending.current = pending;
  }, [pending, state]);

  const bsHint = (() => {
    try {
      return toBsDisplay(new Date(dateValue));
    } catch {
      return null;
    }
  })();

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#A8241E] text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-md hover:bg-[#931e19] whitespace-nowrap cursor-pointer"
      >
        ＋ Add coupon
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100] p-5"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-white rounded-xl w-full max-w-[460px] max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C9C4B3]">
            <div className="flex justify-between items-center px-5.5 py-4 border-b border-[#E2DED2]">
              <h2 className="font-display text-[17px] font-semibold text-[#16181F]">Add coupon</h2>
              <button onClick={() => setOpen(false)} className="text-[#8A8E99] hover:text-[#16181F] text-lg font-mono">
                ✕
              </button>
            </div>

            <form ref={formRef} action={formAction} className="p-5.5">
              {state.error && (
                <p className="text-[13px] text-[#A8241E] bg-[#F4E2DE] border border-[#A8241E]/30 rounded-md px-3 py-2 mb-4">
                  {state.error}
                </p>
              )}

              <Field label="Coupon number" required error={state.fieldErrors?.couponNumber}>
                <input
                  name="couponNumber"
                  placeholder="007315254493"
                  required
                  className="font-mono w-full px-3 py-2.5 border border-[#C9C4B3] rounded-md text-[13.5px] outline-none focus:border-[#1E3A5F]"
                />
              </Field>

              <Field label="Bill number (optional)" error={state.fieldErrors?.billNumber}>
                <input
                  name="billNumber"
                  placeholder="123456789 (optional)"
                  className="font-mono w-full px-3 py-2.5 border border-[#C9C4B3] rounded-md text-[13.5px] outline-none focus:border-[#1E3A5F]"
                />
              </Field>

              <Field label="Purchase date" error={state.fieldErrors?.purchaseDate}>
                <input
                  type="date"
                  name="purchaseDate"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  className="font-mono w-full px-3 py-2.5 border border-[#C9C4B3] rounded-md text-[13.5px] outline-none focus:border-[#1E3A5F]"
                />
                {bsHint && (
                  <p className="font-mono text-xs text-[#565B66] mt-1.5">
                    ≈ {bsHint} BS (calculated automatically)
                  </p>
                )}
              </Field>

              <Field label="Bill photo">
                <label className="block border border-dashed border-[#C9C4B3] rounded-lg p-5 text-center text-[13px] text-[#565B66] cursor-pointer hover:border-[#1E3A5F]">
                  <input type="file" name="billPhoto" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Bill preview"
                      width={200}
                      height={120}
                      unoptimized
                      className="max-h-32 mx-auto rounded object-contain"
                    />
                  ) : (
                    <>
                      <span className="block text-xl mb-1.5">📷</span>
                      Tap to add a photo of your bill
                    </>
                  )}
                </label>
              </Field>

              <div className="flex justify-end gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-white text-[#16181F] border border-[#C9C4B3] font-semibold text-[13.5px] px-4 py-2.5 rounded-md hover:bg-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-[#A8241E] text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-md hover:bg-[#931e19] disabled:opacity-60 cursor-pointer"
                >
                  {pending ? "Saving…" : "Save coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-[12.5px] font-semibold mb-1.5 text-[#16181F]">
        {label} {required && <span className="text-[#A8241E]">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-[#A8241E] mt-1.5 font-mono">{error}</p>}
    </div>
  );
}
