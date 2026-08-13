"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createCouponAction, type AddCouponState } from "@/lib/actions/coupons";
import { toBsDisplay } from "@/lib/bs-date";

const initialState: AddCouponState = {};

export function AddCouponDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createCouponAction, initialState);
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  // Close + reset once a submit finishes with no error (success case).
  useEffect(() => {
    if (wasPending.current && !pending && !state.error && !state.fieldErrors) {
      setOpen(false);
      setPhotoPreview(null);
      formRef.current?.reset();
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
        className="bg-stamp-red text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-md hover:bg-[#931e19] whitespace-nowrap"
      >
        ＋ Add coupon
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-[100] p-5"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="bg-paper-raised rounded-xl w-full max-w-[460px] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center px-5.5 py-5 border-b border-line">
              <h2 className="font-display text-[17px] font-semibold">Add coupon</h2>
              <button onClick={() => setOpen(false)} className="text-ink-faint text-lg leading-none">
                ✕
              </button>
            </div>

            <form ref={formRef} action={formAction} className="p-5.5">
              {state.error && (
                <p className="text-[13px] text-stamp-red bg-stamp-red-soft border border-[#E4BEB9] rounded-md px-3 py-2 mb-4">
                  {state.error}
                </p>
              )}

              <Field label="Coupon number" required error={state.fieldErrors?.couponNumber}>
                <input
                  name="couponNumber"
                  placeholder="007315254493"
                  required
                  className="font-mono w-full px-3 py-2.5 border border-line-strong rounded-md text-[13.5px] outline-none focus:border-seal-blue"
                />
              </Field>

              <Field label="Bill number" required error={state.fieldErrors?.billNumber}>
                <input
                  name="billNumber"
                  placeholder="123456789"
                  required
                  className="font-mono w-full px-3 py-2.5 border border-line-strong rounded-md text-[13.5px] outline-none focus:border-seal-blue"
                />
              </Field>

              <Field label="Purchase date" error={state.fieldErrors?.purchaseDate}>
                <input
                  type="date"
                  name="purchaseDate"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  className="font-mono w-full px-3 py-2.5 border border-line-strong rounded-md text-[13.5px] outline-none focus:border-seal-blue"
                />
                {bsHint && (
                  <p className="font-mono text-xs text-ink-soft mt-1.5">
                    ≈ {bsHint} BS (calculated automatically)
                  </p>
                )}
              </Field>

              <Field label="Bill photo">
                <label className="block border border-dashed border-line-strong rounded-lg p-5 text-center text-[13px] text-ink-soft cursor-pointer hover:border-seal-blue">
                  <input type="file" name="billPhoto" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  {photoPreview ? (
                    <img src={photoPreview} alt="Bill preview" className="max-h-32 mx-auto rounded" />
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
                  className="bg-paper-raised text-ink border border-line-strong font-semibold text-[13.5px] px-4 py-2.5 rounded-md hover:bg-[#F1EFE7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-stamp-red text-white font-semibold text-[13.5px] px-4 py-2.5 rounded-md hover:bg-[#931e19] disabled:opacity-60"
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
      <label className="block text-[12.5px] font-semibold mb-1.5">
        {label} {required && <span className="text-stamp-red">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-stamp-red mt-1.5">{error}</p>}
    </div>
  );
}
