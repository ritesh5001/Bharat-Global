"use client";

import { useState } from "react";
import { GraduationCap, Headphones, Scale, X } from "lucide-react";
import { useSite } from "./site-context";

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full ${light ? "bg-navy text-white" : "bg-navy text-white"}`}
      >
        <GraduationCap className="size-6" strokeWidth={2.2} />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-[17px] font-extrabold tracking-tight text-navy`}>BHARAT GLOBAL</span>
        <span className="mt-0.5 block text-[10px] font-bold tracking-[0.25em] text-navy/80">EDUCATION</span>
        {!compact && (
          <span className="mt-0.5 block text-[8px] font-semibold tracking-[0.12em] text-slate-500">
            YOUR DREAM | OUR COMMITMENT
          </span>
        )}
      </span>
    </div>
  );
}

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 pr-10 text-[12px] sm:text-[13px]">
        <span className="shrink-0 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold tracking-wider">
          ADMISSIONS OPEN
        </span>
        <span className="font-medium">Compare 100% UGC-DEB Approved Universities &amp; Avail No-Cost EMI Options</span>
      </div>
      <button
        aria-label="Dismiss announcement"
        onClick={() => setOpen(false)}
        className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function Header() {
  const { compare, openModal, showToast } = useSite();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#top" aria-label="Bharat Global Education home">
          <Logo />
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          <a href="#universities" className="hover:text-brand">Universities</a>
          <a href="#why-us" className="hover:text-brand">Why Us</a>
          <a href="#expert" className="hover:text-brand">Talk to Expert</a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              compare.length >= 2
                ? openModal({ type: "compare" })
                : showToast("Please select at least 2 universities to compare side-by-side.")
            }
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
            aria-label={`Compare list, ${compare.length} selected`}
          >
            <Scale className="size-4 text-brand" />
            <span className="grid size-5 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
              {compare.length}
            </span>
          </button>
          <button
            onClick={() => openModal({ type: "lead", title: "General Career Counseling", source: "counseling" })}
            className="btn-brand px-3.5 py-2.5 text-[13px] leading-tight"
          >
            <Headphones className="size-4" />
            <span className="text-left">
              Free
              <br className="sm:hidden" /> Counseling
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
