"use client";

import { ArrowRight, Headset, IndianRupee, LifeBuoy, Mail, MapPin, MessageCircle, Phone, Scale, X } from "lucide-react";
import { LeadForm } from "./lead-form";
import { Logo } from "./header";
import { MAX_COMPARE, useSite } from "./site-context";

export function CompareTray() {
  const { compare, byId, removeCompare, clearCompare, openModal, showToast } = useSite();
  if (!compare.length) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-navy text-white shadow-[0_-8px_24px_rgba(11,35,80,.35)] animate-fade">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0">
            <p className="text-[12px] font-bold tracking-wider">COMPARE LIST</p>
            <p className="text-[11px] text-white/60">
              {compare.length} of {MAX_COMPARE} selected
            </p>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {compare.map((id) => (
              <span key={id} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold">
                {byId.get(id)?.shortName}
                <button onClick={() => removeCompare(id)} aria-label={`Remove ${byId.get(id)?.shortName}`} className="opacity-70 hover:opacity-100">
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 sm:ml-auto">
          <button onClick={clearCompare} className="px-3 text-[13px] font-semibold text-white/80 hover:text-white">
            Clear All
          </button>
          <button
            onClick={() =>
              compare.length < 2
                ? showToast("Please select at least 2 universities to compare side-by-side.")
                : openModal({ type: "compare" })
            }
            className="btn-brand py-2.5 text-sm"
          >
            Compare Now <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Scale, bg: "bg-navy", title: "100% Unbiased Comparison", text: "Compare real total fees, semester breakdowns, and NAAC grades side by side." },
  { icon: Headset, bg: "bg-brand", title: "1-on-1 Senior Counselors", text: "Personalized mentorship based on your current job profile, budget, and career goal." },
  { icon: IndianRupee, bg: "bg-green-600", title: "Direct University Fee Payment", text: "Pay tuition fees directly to the official university portal with No-Cost EMI assistance." },
  { icon: LifeBuoy, bg: "bg-navy", title: "Post-Admission Support", text: "End-to-end assistance from LMS onboarding to exam schedules and degree dispatch." },
];

export function WhyChoose() {
  return (
    <section id="why-us" className="scroll-mt-20 bg-white py-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-brand">Why choose Bharat Global Education</p>
          <h2 className="mt-3 font-display text-[28px] font-extrabold leading-tight text-navy sm:text-4xl">
            Your Dream | Our Commitment — Honest Guidance Without Hidden Charges
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
            Choosing the right online or distance university shapes your career. We help you compare verified fee
            structures, exam patterns, and placement records across India&apos;s top universities.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, bg, title, text }) => (
              <div key={title} className="flex gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-white ${bg}`}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="expert" className="scroll-mt-24 self-start rounded-3xl bg-gradient-to-br from-navy to-navy-700 p-6 text-white shadow-xl shadow-navy/25 sm:p-8">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">Free Career Guidance</span>
          <h3 className="mt-3 font-display text-2xl font-extrabold">Talk to an Admission Expert</h3>
          <p className="mb-5 mt-1 text-[13px] text-white/70">Get personalized fee structure &amp; scholarship eligibility on WhatsApp/Call.</p>
          <LeadForm source="expert-form" variant="expert" submitLabel="Request Free Call Back" />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { programs, universities, settings } = useSite();
  return (
    <footer className="bg-navy pb-36 pt-12 text-white sm:pb-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="inline-block rounded-2xl bg-white px-4 py-3">
            <Logo compact />
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-white/70">
            <b className="text-white">Your Dream | Our Commitment.</b> Bharat Global Education is an unbiased higher-education
            discovery and counseling platform helping students compare UGC-approved online &amp; distance universities.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Popular Online Courses</h4>
          <ul className="mt-3 space-y-2 text-[13.5px] text-white/70">
            {programs.map((p) => (
              <li key={p.id}>
                <a href="#universities" className="hover:text-brand">{p.name} ({p.duration})</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Top Partner Universities</h4>
          <ul className="mt-3 space-y-2 text-[13.5px] text-white/70">
            {universities.slice(0, 5).map((u) => (
              <li key={u.id}>{u.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Student Helpline</h4>
          <ul className="mt-3 space-y-3 text-[13.5px] text-white/80">
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>{settings.phone} ({settings.helplineHours})</a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
              <a href={`mailto:${settings.email}`} className="break-all">{settings.email}</a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand" /> {settings.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-center text-[12.5px] text-white/60">
        <p>© {new Date().getFullYear()} Bharat Global Education. All Rights Reserved.</p>
        <p className="mt-2">Disclaimer: All university names, logos, and fee figures are indicative for comparison purposes.</p>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  const { settings, compare } = useSite();
  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hi, I need help choosing an online university.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed right-4 z-50 grid size-14 place-items-center rounded-full bg-green-500 text-white shadow-lg shadow-green-600/40 transition hover:scale-105 ${
        compare.length ? "bottom-32 sm:bottom-24" : "bottom-5"
      }`}
    >
      <MessageCircle className="size-7 fill-white/20" />
    </a>
  );
}

export function Toast() {
  const { toast } = useSite();
  if (!toast) return null;
  return (
    <div className="fixed inset-x-0 top-20 z-[70] flex justify-center px-4 animate-pop">
      <div role="status" className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13.5px] font-medium text-slate-800 shadow-xl">
        <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-brand text-[10px] font-bold text-white">!</span>
        {toast}
      </div>
    </div>
  );
}
