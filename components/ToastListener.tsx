"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function ToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const toastParam = searchParams.get("toast");
    if (!toastParam) return;

    if (toastParam === "logged_in") {
      toast.success("Logged in successfully! Welcome back.");
    } else if (toastParam === "registered") {
      toast.success("Account created successfully! Welcome to PrizeTrack.");
    } else if (toastParam === "logged_out") {
      toast.info("Logged out successfully. See you soon!");
    } else if (toastParam === "password_reset") {
      toast.success("Your password has been updated successfully.");
    }

    // Clean up the query param from the URL cleanly without page reload
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("toast");
    const newQuery = newParams.toString();
    const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return null;
}
