import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrizeTrack — IRD Prize Tracker",
  description:
    "Save your IRD prize coupons once and automatically check them against published official IRD winner lists.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PrizeTrack",
  },
};

export const viewport: Viewport = {
  themeColor: "#16181F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-[#16181F]">{children}</body>
    </html>
  );
}
