"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or installed the app
    const isDismissed = localStorage.getItem("meroprize_pwa_dismissed");
    if (isDismissed) return;

    // Check if running as installed standalone PWA
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (iosDevice) {
      setIsIos(true);
      setShowPrompt(true);
      return;
    }

    // Android / Desktop Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("meroprize_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 bg-[#16181F] text-white p-4 rounded-xl border border-[#2B2D38] shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#21242E] rounded-xl flex items-center justify-center shrink-0 border border-[#333745]">
            <Image src="/trophy-icon.png" alt="MeroPrize" width={28} height={32} className="object-contain" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white">Install MeroPrize App</h4>
            <p className="text-xs text-[#A8ABB5] mt-0.5">Quick access to check coupons & draw results offline</p>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-[#8C919E] hover:text-white p-1 rounded-md">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-[#262832] flex items-center justify-end gap-2">
        {isIos ? (
          <div className="text-[11px] font-mono text-[#D6D8DE] flex items-center gap-1.5 bg-[#21242E] px-3 py-1.5 rounded-lg border border-[#2B2D38] w-full">
            <Share className="w-3.5 h-3.5 text-[#A8241E] shrink-0" />
            Tap <strong className="text-white">Share</strong> then <strong className="text-white">Add to Home Screen</strong>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="bg-[#A8241E] hover:bg-[#8c1a15] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer w-full justify-center"
          >
            <Download className="w-3.5 h-3.5" />
            Install App
          </button>
        )}
      </div>
    </div>
  );
}
