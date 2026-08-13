"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { requestPasswordResetAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(requestPasswordResetAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success(state.message || "Password reset email sent!");
    }
  }, [state.error, state.success, state.message]);

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
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-[#565B66]">
          Enter your email address and we&apos;ll generate instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#C9C4B3] rounded-xl sm:px-10">
          {state.error && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#F4E2DE] border border-[#A8241E]/40 text-[#A8241E] text-xs font-mono">
              {state.error}
            </div>
          )}

          {state.success ? (
            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-[#EBF5ED] border border-[#2D8A4E]/30 text-[#1B522E] text-sm leading-relaxed">
                <p className="font-semibold mb-1">Check your inbox</p>
                <p className="text-xs">{state.message}</p>
              </div>

              <div className="border-t border-[#E2DED2] pt-4 text-center">
                <Link href="/login" className="text-xs font-semibold text-[#A8241E] hover:underline">
                  ← Return to Log in
                </Link>
              </div>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#565B66]">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1.5 block w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2DED2] rounded-md text-sm text-[#16181F] focus:outline-none focus:border-[#A8241E] focus:ring-1 focus:ring-[#A8241E]"
                />
                {state.fieldErrors?.email && (
                  <p className="mt-1 text-xs text-[#A8241E] font-mono">{state.fieldErrors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-[#16181F] text-[#FAF9F5] text-sm font-semibold rounded-md shadow-sm hover:bg-[#2b2e38] focus:outline-none disabled:opacity-50 transition-colors"
              >
                {isPending ? "Generating reset link..." : "Send reset link →"}
              </button>

              <div className="border-t border-[#E2DED2] pt-4 text-center text-xs text-[#565B66]">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-[#A8241E] hover:underline">
                  Log in here
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
