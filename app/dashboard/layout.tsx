import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileHeader } from "@/components/dashboard/MobileHeader";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col md:flex-row">
      <MobileHeader userEmail={user.email} />
      <Sidebar userEmail={user.email} />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-8 pb-16 max-w-[1080px] w-full">{children}</main>
    </div>
  );
}
