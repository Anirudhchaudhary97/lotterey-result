import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeroPrize — Pay Bill • Win Everyday",
  description:
    "Save your IRD prize coupons once and automatically check them against published official IRD winner lists.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MeroPrize",
  },
};

export const viewport: Viewport = {
  themeColor: "#16181F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import ToastProvider from "@/components/ToastProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-[#16181F]">
        {children}
        <ToastProvider />
        <ServiceWorkerRegister />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
