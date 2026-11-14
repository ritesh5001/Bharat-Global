"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useSite } from "./site-context";

export function Hero() {
  const { openModal, universities } = useSite();
  return (
    <section id="top" className="mx-auto max-w-3xl px-4 pb-6 pt-7 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-navy shadow-sm">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
        India&apos;s Unbiased Online &amp; Distance University Comparison Portal
      </div>

      <h1 className="mt-5 font-display text-[28px] font-extrabold leading-[1.15] tracking-tight text-navy sm:text-5xl">
        Compare <span className="text-brand">{Math.max(100, universities.length)}+ UGC-Approved</span> Universities
        &amp; Fees Line-by-Line
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
        Transparent semester fees, NAAC ratings, No-Cost EMI options, and placement reviews—compare every university
        side-by-side before you enroll.
      </p>

      <button
        onClick={() => openModal({ type: "quiz" })}
        className="btn-navy mx-auto mt-6 w-full max-w-md justify-between rounded-2xl py-3.5 text-sm shadow-lg shadow-navy/20"
      >
        <Sparkles className="size-5 text-brand" />
        <span>Confused? Find Your Best University in 30 Seconds</span>
        <ArrowRight className="size-4" />
      </button>
    </section>
  );
}
