import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F5]">
      <Sidebar userEmail={user.email} />
      <main className="flex-1 px-6 md:px-10 py-8 pb-16 max-w-[1080px]">{children}</main>
    </div>
  );
}
