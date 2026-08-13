"use client";

import { useEffect, useState } from "react";
import type { CouponDTO } from "@/lib/coupon-dto";

interface WinnerModalProps {
  coupon: CouponDTO | null;
  onClose: () => void;
}

export function WinnerModal({ coupon, onClose }: WinnerModalProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  } | null>(null);

  useEffect(() => {
    if (!coupon?.draw?.claimDeadline) return;

    const deadline = new Date(coupon.draw.claimDeadline).getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [coupon]);

  if (!coupon) return null;

  const isBumper = coupon.draw?.categoryTitleEn?.toLowerCase().includes("bumper");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF9F5] border border-[#C9C4B3] rounded-xl shadow-2xl p-6.5 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold/Red Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#B08A28] via-[#A8241E] to-[#B08A28]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xs font-mono text-[#565B66] hover:text-[#16181F] bg-[#E2DED2]/50 hover:bg-[#E2DED2] w-7 h-7 rounded-full flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="text-center mt-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E9D2] text-[#7A5E15] font-mono text-xs font-semibold mb-3 border border-[#B08A28]/30">
            <span>🏆</span> PRIZE WINNER
          </div>
          <h2 className="font-display font-bold text-2xl text-[#16181F]">🎉 Congratulations!</h2>
          <p className="text-sm text-[#565B66] mt-1">Your coupon matched an official published IRD draw.</p>
        </div>

        {/* Coupon Details Card */}
        <div className="bg-white border border-[#C9C4B3] rounded-lg p-5 mb-5 space-y-3 shadow-xs">
          <div className="flex justify-between items-start border-b border-[#E2DED2] pb-3">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#565B66]">Coupon Number</div>
              <div className="font-mono text-xl font-bold text-[#16181F] tracking-wide mt-0.5">
                {coupon.couponNumber}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#565B66]">Rank</div>
              <div className="font-display text-lg font-bold text-[#A8241E]">
                #{coupon.winnerRank ?? 1}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div>
              <span className="text-[#565B66] block">Prize Category</span>
              <span className="font-semibold text-[#16181F]">{coupon.draw?.categoryTitleEn || "General Draw"}</span>
            </div>
            <div>
              <span className="text-[#565B66] block">Draw Period</span>
              <span className="font-semibold text-[#16181F]">{coupon.draw?.titleEn || "Official Draw"}</span>
            </div>
            <div>
              <span className="text-[#565B66] block">Bill Number</span>
              <span className="font-semibold text-[#16181F]">{coupon.billNumber}</span>
            </div>
            <div>
              <span className="text-[#565B66] block">Purchase Date</span>
              <span className="font-semibold text-[#16181F]">{coupon.purchaseDateBS || coupon.purchaseDate}</span>
            </div>
          </div>
        </div>

        {/* Claim Countdown Card */}
        {timeLeft && (
          <div
            className={`p-4 rounded-lg border mb-5 font-mono text-xs ${
              timeLeft.expired
                ? "bg-[#F4E2DE] border-[#A8241E] text-[#A8241E]"
                : timeLeft.days <= 3
                ? "bg-[#F3E9D2] border-[#B08A28] text-[#7A5E15]"
                : "bg-[#E4EAF1] border-[#1E3A5F] text-[#1E3A5F]"
            }`}
          >
            <div className="font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>⏰</span>
              {timeLeft.expired
                ? "🔴 Claim Period Closed"
                : timeLeft.days <= 3
                ? "⚠️ Claim Deadline Approaching"
                : "Claim Deadline Countdown"}
            </div>
            {!timeLeft.expired ? (
              <div className="text-base font-bold tracking-tight">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s remaining
              </div>
            ) : (
              <div className="text-xs">The claim deadline for this draw has passed.</div>
            )}
            <div className="text-[11px] opacity-80 mt-1">
              Claim Deadline: {new Date(coupon.draw!.claimDeadline).toLocaleString()}
            </div>
          </div>
        )}

        {/* Claim Instructions */}
        <div className="text-xs text-[#565B66] bg-[#FAF9F5] p-3.5 rounded border border-[#E2DED2] mb-5">
          <span className="font-semibold text-[#16181F] block mb-1">How to claim your prize:</span>
          Visit your local Inland Revenue Office (IRD) with your original bill, physical coupon receipt, and citizenship document.
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#16181F] text-[#FAF9F5] font-semibold text-sm py-2.5 rounded hover:bg-[#2b2e38] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
