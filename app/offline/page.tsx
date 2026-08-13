"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#16181F] flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-[#E2DED2] shadow-sm">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        <div className="w-16 h-16 bg-[#FDF2F0] text-[#A8241E] rounded-full flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-[#16181F]">You are offline</h1>
          <p className="text-sm text-[#565B66]">
            Please check your internet connection. Saved coupons and offline data will automatically sync once you are back online.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-[#16181F] text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#2b2e38] transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
          <Link
            href="/dashboard"
            className="flex-1 bg-[#FAF9F5] text-[#16181F] border border-[#E2DED2] text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-[#eae6d8] transition-colors flex items-center justify-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
