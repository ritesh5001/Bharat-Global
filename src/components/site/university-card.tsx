"use client";

import { ArrowUpRight, CheckSquare, Clock, FileText, MapPin, PlusSquare, Zap } from "lucide-react";
import { inr } from "@/lib/format";
import type { UniversityDTO } from "@/lib/types";
import { useSite } from "./site-context";

export function UniLogo({ u, size = "md" }: { u: UniversityDTO; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "size-10 text-[11px]" : "size-12 text-sm";
  if (u.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={u.logoUrl} alt={u.name} className={`${dim} shrink-0 rounded-xl object-contain bg-white`} />;
  }
  const fs = u.initials.length > 3 ? "text-[10px]" : "";
  return (
    <span
      className={`${dim} ${fs} grid shrink-0 place-items-center rounded-xl font-display font-extrabold tracking-tight text-white`}
      style={{ backgroundColor: u.logoColor }}
    >
      {u.initials}
    </span>
  );
}

export function Badges({ u, wes = false }: { u: UniversityDTO; wes?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {u.ugcDeb && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">UGC-DEB</span>}
      {u.naacGrade && (
        <span className="rounded-md bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">NAAC {u.naacGrade}</span>
      )}
      {u.nirfRank && (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
          NIRF {u.nirfRank}
        </span>
      )}
      {wes && u.wesAccredited && (
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">WES Accredited</span>
      )}
    </div>
  );
}

export function UniversityCard({ u }: { u: UniversityDTO }) {
  const { compare, toggleCompare, openModal } = useSite();
  const added = compare.includes(u.id);

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex gap-3">
        <UniLogo u={u} />
        <div className="min-w-0">
          <Badges u={u} />
          <h3 className="mt-1.5 font-display text-[17px] font-bold leading-snug text-navy">{u.name}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[13px] text-slate-500">
            <MapPin className="size-3.5 text-brand" /> {u.city}, {u.state}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[15px] font-bold text-slate-900">{u.featuredProgram}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[13px] text-slate-500">
          <Clock className="size-3.5" /> {u.duration}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {u.courseTags.map((t) => (
            <span key={t} className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3.5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Course Fee</p>
          <p className="font-display text-xl font-extrabold text-slate-900">{inr(u.totalFee)}</p>
        </div>
        <span className="flex items-center gap-1 rounded-lg border border-green-100 bg-green-50 px-2 py-1 text-[12px] font-bold text-green-700">
          <Zap className="size-3.5 fill-green-600" /> EMI {inr(u.emiPerMonth)}/mo
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          onClick={() => toggleCompare(u.id)}
          aria-pressed={added}
          className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition ${
            added ? "border-navy bg-navy text-white" : "border-slate-200 bg-white text-slate-800 hover:border-navy"
          }`}
        >
          {added ? <CheckSquare className="size-4" /> : <PlusSquare className="size-4" />}
          {added ? "Added" : "Compare"}
        </button>
        <button
          onClick={() => openModal({ type: "fees", universityId: u.id })}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200"
        >
          <FileText className="size-4" /> Fee Details
        </button>
        <button
          onClick={() => openModal({ type: "lead", title: u.name, source: "apply", universityId: u.id })}
          className="btn-brand py-2.5 text-sm"
        >
          Apply Now <ArrowUpRight className="size-4" />
        </button>
      </div>
    </article>
  );
}
