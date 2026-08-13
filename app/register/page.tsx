"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

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
          Create your free account
        </h2>
        <p className="mt-2 text-center text-sm text-[#565B66]">
          Start tracking your IRD coupons automatically in less than a minute.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#C9C4B3] rounded-xl sm:px-10">
          {state.error && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#F4E2DE] border border-[#A8241E]/40 text-[#A8241E] text-xs font-mono">
              {state.error}
            </div>
          )}

          {/* Google Sign Up Button */}
          <div className="mb-5">
            <a
              href="/api/auth/google"
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-[#FAF9F5] border border-[#C9C4B3] rounded-lg text-[#16181F] text-sm font-semibold shadow-sm transition-all hover:border-[#8C8F99] active:scale-[0.99]"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign up with Google
            </a>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2DED2]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-mono text-[#8C8F99] tracking-wider">OR</span>
            </div>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#565B66]">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ram Sharma"
                className="mt-1.5 block w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2DED2] rounded-md text-sm text-[#16181F] focus:outline-none focus:border-[#A8241E] focus:ring-1 focus:ring-[#A8241E]"
              />
              {state.fieldErrors?.name && (
                <p className="mt-1 text-xs text-[#A8241E] font-mono">{state.fieldErrors.name}</p>
              )}
            </div>

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

            <div>
              <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-[#565B66]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="At least 6 characters"
                className="mt-1.5 block w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#E2DED2] rounded-md text-sm text-[#16181F] focus:outline-none focus:border-[#A8241E] focus:ring-1 focus:ring-[#A8241E]"
              />
              {state.fieldErrors?.password && (
                <p className="mt-1 text-xs text-[#A8241E] font-mono">{state.fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 px-4 bg-[#A8241E] text-white text-sm font-semibold rounded-md shadow-sm border border-[#8c1a15] hover:bg-[#931e19] focus:outline-none disabled:opacity-50 transition-colors"
            >
              {isPending ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <div className="mt-6 border-t border-[#E2DED2] pt-6 text-center text-xs text-[#565B66]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#16181F] hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
