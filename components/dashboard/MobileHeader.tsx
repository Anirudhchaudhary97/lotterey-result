"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Trophy, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { BrandLogo } from "@/components/BrandLogo";

export function MobileHeader({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <header className="md:hidden bg-[#14161C] text-white border-b border-[#262832] px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between mb-3">
        <BrandLogo darkBg size="sm" showTagline={false} />

        <form action={logoutAction} className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#8A8E99] truncate max-w-[120px]">
            {userEmail}
          </span>
          <button type="submit" className="text-xs text-[#A8241E] font-mono hover:underline cursor-pointer">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto pb-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
            pathname === "/dashboard"
              ? "bg-[#1F2129] text-white border border-[#2B2D38]"
              : "text-[#A8ABB5]"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/coupons"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
            pathname.startsWith("/dashboard/coupons")
              ? "bg-[#1F2129] text-white border border-[#2B2D38]"
              : "text-[#A8ABB5]"
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          Coupons
        </Link>
        <Link
          href="/dashboard/draws"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
            pathname.startsWith("/dashboard/draws")
              ? "bg-[#1F2129] text-white border border-[#2B2D38]"
              : "text-[#A8ABB5]"
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Draws
        </Link>
      </nav>
    </header>
  );
}
