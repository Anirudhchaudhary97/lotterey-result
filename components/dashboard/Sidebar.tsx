"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { logoutAction } from "@/lib/actions/auth";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "▤" },
  { href: "/dashboard", label: "Coupons", icon: "🎟" },
  { href: "/dashboard", label: "Draws", icon: "▦" },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#14161C] text-[#E7E7EA] p-6 flex flex-col hidden md:flex shrink-0">
      <Link href="/" className="font-display font-bold text-[17px] flex items-center gap-2 px-2 pb-7">
        <span className="w-2 h-2 rounded-full bg-[#A8241E]" />
        PrizeTrack
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {LINKS.map((link, idx) => {
          const active = idx === 0 && pathname === "/dashboard";
          return (
            <Link
              key={idx}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors ${
                active ? "bg-[#1F2129] text-white" : "text-[#A8ABB5] hover:text-white"
              }`}
            >
              <span className="font-mono text-xs w-4 text-center">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pt-4 border-t border-[#262832] space-y-3">
        <div className="text-[12px] text-[#6F7280]">
          Signed in as
          <br />
          <span className="text-[#D6D8DE] font-mono text-[11px] truncate block">{userEmail}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            onClick={() => toast.info("Logged out successfully")}
            className="w-full text-left text-xs font-mono text-[#A8241E] hover:text-[#f4e2de] flex items-center gap-2 transition-colors py-1"
          >
            <span>↳</span> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
