"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Trophy, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import { logoutAction } from "@/lib/actions/auth";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/coupons", label: "Coupons", icon: Ticket },
  { href: "/dashboard/draws", label: "Draws", icon: Trophy },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#14161C] text-[#E7E7EA] p-6 flex flex-col hidden md:flex shrink-0 border-r border-[#262832]">
      <Link href="/" className="font-display font-bold text-[18px] flex items-center gap-2.5 px-2 pb-8">
        <span className="w-2.5 h-2.5 rounded-full bg-[#A8241E] shadow-sm shadow-[#A8241E]/50" />
        PrizeTrack
      </Link>

      <nav className="flex flex-col gap-1.5 flex-1">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#1F2129] text-white shadow-sm font-semibold border border-[#2B2D38]"
                  : "text-[#A8ABB5] hover:text-white hover:bg-[#1A1C24]"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-[#A8241E]" : "text-[#8A8E99]"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-[#262832] space-y-3">
        <div className="text-[12px] text-[#6F7280]">
          Signed in as
          <span className="text-[#D6D8DE] font-mono text-[11px] truncate block mt-0.5" title={userEmail}>
            {userEmail}
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            onClick={() => toast.info("Logged out successfully")}
            className="w-full text-left text-xs font-mono text-[#A8241E] hover:text-[#f4e2de] flex items-center gap-2 transition-colors py-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
