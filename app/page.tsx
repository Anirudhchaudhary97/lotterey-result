"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

const FAQS = [
  {
    q: "Is this the official IRD site?",
    a: "No. MeroPrize is an independent, unofficial tool that reads IRD's published winner data. Enrollment, claims, and prize disbursement all still happen through official IRD channels.",
  },
  {
    q: "How quickly do you know when I've won?",
    a: "We sync against IRD's published results on a regular schedule, so your dashboard reflects results shortly after they go public — you don't need to check anything yourself.",
  },
  {
    q: "Do you store my coupon numbers anywhere public?",
    a: "No. Your saved coupons and bill photos are visible only to your account. We separately cache IRD's public winner list once and match it against everyone's coupons on our side.",
  },
  {
    q: "What if I have coupons from before I joined?",
    a: "Add them the same way — as long as you still have the coupon and bill numbers, we'll check them against any draw whose eligibility window covers your purchase date.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#FAF9F5] text-[#16181F] min-h-screen font-body selection:bg-[#F4E2DE] selection:text-[#A8241E]">
      {/* ---------- NAV ---------- */}
      <nav className="sticky top-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E2DED2]">
        <div className="max-w-[1160px] mx-auto px-7 h-[68px] flex items-center justify-between">
          <BrandLogo size="md" />

          <div className="hidden md:flex items-center gap-9">
            <a href="#how" className="text-[14.5px] text-[#565B66] font-medium hover:text-[#16181F]">
              How it works
            </a>
            <a href="#features" className="text-[14.5px] text-[#565B66] font-medium hover:text-[#16181F]">
              Features
            </a>
            <a href="#faq" className="text-[14.5px] text-[#565B66] font-medium hover:text-[#16181F]">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-4.5">
            <Link href="/login" className="text-[14.5px] font-medium text-[#16181F] hover:opacity-80">
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-[#16181F] text-[#FAF9F5] text-[14.5px] font-semibold px-4.5 py-2.5 rounded hover:bg-[#2b2e38] transition-colors"
            >
              Start tracking
            </Link>
          </div>
        </div>
      </nav>

      {/* ---------- HERO ---------- */}
      <header className="py-22 md:py-24 px-7 max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <span className="font-mono text-[12.5px] uppercase tracking-wider text-[#A8241E] font-medium flex items-center gap-2 mb-5 before:content-[''] before:w-4.5 before:h-px before:bg-[#A8241E]">
              Unofficial · IRD bill-lottery companion
            </span>
            <h1 className="font-display font-semibold tracking-tight text-[38px] sm:text-[48px] lg:text-[56px] leading-[1.05] mb-5">
              Save the coupon.
              <br />
              Forget the rest. <em className="not-italic text-[#A8241E]">We&apos;ll check.</em>
            </h1>
            <p className="text-[17.5px] text-[#565B66] max-w-[460px] mb-8 leading-relaxed">
              Enroll your bill on IRD like always. Save the coupon number here on <strong>MeroPrize</strong>, and we&apos;ll match it against every published winner list — automatically!
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              <Link
                href="/register"
                className="bg-[#A8241E] text-white font-semibold text-[14.5px] px-5 py-3 rounded border border-[#8c1a15] hover:bg-[#931e19] transition-colors shadow-sm"
              >
                Start tracking free
              </Link>
              <a href="#how" className="text-[14.5px] font-medium text-[#16181F] hover:underline">
                See how it works →
              </a>
            </div>
            <div className="mt-4.5 text-[13px] text-[#565B66] font-mono">
              NO CREDIT CARD · FREE · YOUR COUPONS STAY PRIVATE
            </div>
          </div>

          {/* Ticket Stub Graphic */}
          <div className="relative flex justify-center py-6">
            <div className="absolute w-[340px] h-full top-3 left-1/2 -translate-x-1/2 -rotate-6 bg-white border border-[#E2DED2] rounded-xl -z-10 shadow-sm" />
            <div className="bg-white w-[340px] border border-[#C9C4B3] rounded-xl p-6.5 pb-5 relative rotate-3 shadow-2xl">
              <div className="flex justify-between items-start mb-4.5">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#565B66]">Bumper Prize</div>
                  <div className="font-display text-[14px] font-semibold">Shrawan 1–15, 2083</div>
                </div>
              </div>
              <div className="font-mono text-[24px] font-medium tracking-wide py-3.5 border-y border-dashed border-[#C9C4B3] my-1 mb-4.5">
                007 315254493
              </div>
              <div className="flex justify-between text-xs text-[#565B66] font-mono">
                <span>Bill 123456789</span>
                <span>24 Shrawan 2083</span>
              </div>
              <div className="absolute right-4.5 bottom-6 font-display font-bold text-[22px] text-[#A8241E] border-[3px] border-[#A8241E] px-3 py-1 rounded-md -rotate-9 tracking-wider opacity-90 mix-blend-multiply">
                WINNER
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- LEDGER STRIP ---------- */}
      <div className="border-y border-[#E2DED2] py-5.5 bg-[#FAF9F5]">
        <div className="max-w-[1160px] mx-auto px-7 flex justify-between flex-wrap gap-4 font-mono text-[13.5px] text-[#565B66]">
          <div className="flex items-baseline gap-2">
            <b className="font-display text-[17px] text-[#16181F] font-semibold">2</b> draws synced this fortnight
          </div>
          <div className="flex items-baseline gap-2">
            <b className="font-display text-[17px] text-[#16181F] font-semibold">16</b> winner coupons checked automatically
          </div>
          <div className="flex items-baseline gap-2">
            <b className="font-display text-[17px] text-[#16181F] font-semibold">100%</b> of matching happens on our side
          </div>
        </div>
      </div>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how" className="py-24 max-w-[1160px] mx-auto px-7">
        <div className="max-w-[560px] mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-[#565B66] block mb-3.5">
            The process
          </span>
          <h2 className="font-display font-semibold text-[32px] sm:text-[36px] tracking-tight mb-3.5">
            One extra step. Then you&apos;re done.
          </h2>
          <p className="text-[#565B66] text-base">Everything after &quot;save coupon&quot; happens without you.</p>
        </div>

        <div className="flex flex-col border-t border-[#E2DED2]">
          {[
            {
              tag: "COUPON 01",
              title: "Enroll on IRD, like you already do",
              desc: "Get your bill, enroll it on the official IRD portal, and receive your coupon number as usual. We don't touch that part of the process.",
            },
            {
              tag: "COUPON 02",
              title: "Save the coupon here instead of a notebook",
              desc: "Add the coupon number, bill number, and an optional photo of the bill. We file it under the correct Bikram Sambat draw period automatically.",
            },
            {
              tag: "COUPON 03",
              title: "We watch for the draw",
              desc: "When IRD publishes a Bumper or Daily draw, we pull the full winner list and check it against every coupon you've saved — not just the newest one.",
            },
            {
              tag: "COUPON 04",
              title: "You find out, with the claim deadline attached",
              desc: "A match shows up on your dashboard with the prize category, rank, and exactly how long you have left to claim it.",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[90px_1fr] gap-4 md:gap-7 py-7.5 border-b border-[#E2DED2]"
            >
              <div className="font-mono text-xs text-[#A8241E] border border-[#A8241E] rounded px-2 py-1 w-fit h-fit tracking-wide">
                {step.tag}
              </div>
              <div>
                <h3 className="font-display text-[19px] font-semibold mb-1.5">{step.title}</h3>
                <p className="text-[#565B66] text-[15px] max-w-[520px] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="pb-24 max-w-[1160px] mx-auto px-7">
        <div className="max-w-[560px] mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-[#565B66] block mb-3.5">
            What it actually does
          </span>
          <h2 className="font-display font-semibold text-[32px] sm:text-[36px] tracking-tight mb-3.5">
            Built around your coupons, not IRD&apos;s archive.
          </h2>
          <p className="text-[#565B66] text-base">
            The official site is the source of truth. This is where you keep track of your own entries against it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2DED2] border border-[#E2DED2]">
          {[
            {
              mark: "✓",
              title: "Automatic result checking",
              desc: "Every coupon is re-checked against fresh IRD data as soon as a new draw is published — no manual searching.",
            },
            {
              mark: "बि",
              title: "BS-aware draw periods",
              desc: "Purchase dates are matched to the real eligibility window IRD publishes, not a guess based on day-of-month.",
            },
            {
              mark: "⏱",
              title: "Claim deadline countdown",
              desc: "Winning coupons show exactly how much time is left to claim, pulled straight from the draw's claim deadline.",
            },
            {
              mark: "🔒",
              title: "Private by default",
              desc: "Your coupons and bill photos are yours. We sync public winner data once for everyone — never your personal entries.",
            },
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-7.5 min-h-[190px] flex flex-col justify-between">
              <div className="w-7.5 h-7.5 rounded-full flex items-center justify-center font-mono text-xs font-semibold bg-[#E4EAF1] text-[#1E3A5F] mb-5.5">
                {feat.mark}
              </div>
              <div>
                <h3 className="font-display font-semibold text-base mb-2">{feat.title}</h3>
                <p className="text-sm text-[#565B66] leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* STATUS SHOWCASE */}
        <div className="mt-16">
          <p className="font-mono text-[12.5px] uppercase tracking-wider text-[#565B66] mb-3.5">
            Every coupon carries a status
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <span className="font-mono text-[12.5px] px-3.5 py-1.5 rounded-full bg-[#E4EAF1] text-[#1E3A5F] inline-flex items-center gap-1.5">
              <span className="w-1.75 h-1.75 rounded-full bg-[#1E3A5F]" />
              PENDING
            </span>
            <span className="font-mono text-[12.5px] px-3.5 py-1.5 rounded-full bg-[#EDEDE8] text-[#565B66] inline-flex items-center gap-1.5">
              <span className="w-1.75 h-1.75 rounded-full bg-[#565B66]" />
              NOT SELECTED
            </span>
            <span className="font-mono text-[12.5px] px-3.5 py-1.5 rounded-full bg-[#F3E9D2] text-[#7A5E15] inline-flex items-center gap-1.5">
              <span className="w-1.75 h-1.75 rounded-full bg-[#B08A28]" />
              WINNER
            </span>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="py-24 max-w-[1160px] mx-auto px-7">
        <div className="max-w-[560px] mb-14">
          <span className="font-mono text-xs uppercase tracking-widest text-[#565B66] block mb-3.5">
            Questions
          </span>
          <h2 className="font-display font-semibold text-[32px] sm:text-[36px] tracking-tight">
            Before you start
          </h2>
        </div>

        <div className="border-t border-[#E2DED2]">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border-b border-[#E2DED2]">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left py-5.5 flex justify-between items-center font-display text-[16.5px] font-semibold text-[#16181F] gap-4"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`font-mono text-lg text-[#A8241E] transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5.5 text-[#565B66] text-[14.5px] max-w-[620px] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- FOOTER CTA ---------- */}
      <div className="max-w-[1160px] mx-auto px-7 mb-12">
        <div className="bg-[#16181F] text-[#FAF9F5] rounded-2xl p-12 md:p-16 text-center">
          <h2 className="font-display font-semibold text-[30px] sm:text-[36px] tracking-tight text-[#FAF9F5] mb-3">
            Stop checking. Start tracking.
          </h2>
          <p className="text-[#B6B9C2] text-base max-w-[420px] mx-auto mb-7.5">
            Save your first coupon in under a minute — we&apos;ll take it from there.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#A8241E] text-white font-semibold text-[15px] px-6 py-3 rounded border border-[#8c1a15] hover:bg-[#931e19] transition-colors"
          >
            Start tracking free
          </Link>
        </div>
      </div>

      <footer className="py-14 border-t border-[#E2DED2] max-w-[1160px] mx-auto px-7">
        <div className="flex justify-between items-start flex-wrap gap-6 pb-7 border-b border-[#E2DED2] mb-5.5">
          <BrandLogo size="md" />
          <div className="flex gap-7 text-[13.5px] text-[#565B66]">
            <a href="#how" className="hover:text-[#16181F]">
              How it works
            </a>
            <a href="#features" className="hover:text-[#16181F]">
              Features
            </a>
            <a href="#faq" className="hover:text-[#16181F]">
              FAQ
            </a>
            <Link href="/login" className="hover:text-[#16181F]">
              Log in
            </Link>
          </div>
        </div>
        <p className="text-[12.5px] text-[#565B66] font-mono leading-relaxed max-w-[640px]">
          MEROPRIZE IS AN INDEPENDENT, UNOFFICIAL TOOL AND IS NOT AFFILIATED WITH, ENDORSED BY, OR OPERATED BY THE
          INLAND REVENUE DEPARTMENT, NEPAL. WINNER DATA IS SOURCED FROM IRD&apos;S PUBLIC PUBLICATIONS. ALWAYS CONFIRM
          CLAIM ELIGIBILITY THROUGH OFFICIAL IRD CHANNELS.
        </p>

        <div className="mt-8 pt-6 border-t border-[#E2DED2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#565B66]">
          <div>
            © {new Date().getFullYear()} MeroPrize. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-center sm:justify-end">
            <span>Developed by</span>
            <a
              href="https://www.linkedin.com/in/anurudh-chaudhary-332897202/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#A8241E] hover:underline"
            >
              Anirudh Chaudhary
            </a>
            <span className="text-[#A8ABB5]">·</span>
            <a
              href="mailto:anurudhchaudhary97@gmail.com"
              className="text-[#565B66] hover:text-[#A8241E] hover:underline font-mono"
            >
              anurudhchaudhary97@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
