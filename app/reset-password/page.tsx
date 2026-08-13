"use client";

import { useActionState, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { resetPasswordAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state !== prevStateRef.current) {
      if (state.error) {
        toast.error(state.error);
      } else if (state.success) {
        toast.success(state.message || "Password updated successfully!");
      }
      prevStateRef.current = state;
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#16181F] flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="font-display font-bold text-2xl flex items-center justify-center gap-2 tracking-tight mb-6"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#A8241E]" />
          PrizeTrack
        </Link>
        <h2 className="text-center text-2xl font-bold font-display tracking-tight text-[#16181F]">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-[#565B66]">
          Choose a strong password with at least 6 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#C9C4B3] rounded-xl sm:px-10">
          {!token ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg bg-[#F4E2DE] border border-[#A8241E]/40 text-[#A8241E] text-xs font-mono">
                Invalid or missing password reset token. Please request a new link.
              </div>
              <Link
                href="/forgot-password"
                className="block text-center w-full py-2.5 px-4 bg-[#16181F] text-white rounded-md text-sm font-semibold hover:bg-[#2b2e38] transition-colors"
              >
                Request New Link →
              </Link>
            </div>
          ) : state.success ? (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-[#EBF5ED] border border-[#2D8A4E]/30 text-[#1B522E] text-sm">
                <p className="font-semibold mb-1">Success!</p>
                <p className="text-xs">{state.message}</p>
              </div>
              <Link
                href="/login"
                className="block text-center w-full py-3 px-4 bg-[#A8241E] text-white rounded-md text-sm font-semibold hover:bg-[#931e19] transition-colors shadow-sm"
              >
                Log in with New Password →
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              {state.error && (
                <div className="p-3.5 rounded-lg bg-[#F4E2DE] border border-[#A8241E]/40 text-[#A8241E] text-xs font-mono">
                  {state.error}
                </div>
              )}

              <input type="hidden" name="token" value={token} />

              <div>
                <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#565B66]">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2DED2] rounded-md text-sm text-[#16181F] focus:outline-none focus:border-[#A8241E] focus:ring-1 focus:ring-[#A8241E]"
                />
                {state.fieldErrors?.password && (
                  <p className="mt-1 text-xs text-[#A8241E] font-mono">{state.fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-mono uppercase tracking-wider text-[#565B66]">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2DED2] rounded-md text-sm text-[#16181F] focus:outline-none focus:border-[#A8241E] focus:ring-1 focus:ring-[#A8241E]"
                />
                {state.fieldErrors?.confirmPassword && (
                  <p className="mt-1 text-xs text-[#A8241E] font-mono">{state.fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-[#16181F] text-[#FAF9F5] text-sm font-semibold rounded-md shadow-sm hover:bg-[#2b2e38] focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isPending ? "Updating password..." : "Update password →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-sm font-mono text-[#565B66]">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
