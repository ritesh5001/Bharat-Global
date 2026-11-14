"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Briefcase, CheckCircle2, Scale, Sparkles, X } from "lucide-react";
import { inr } from "@/lib/format";
import type { UniversityDTO } from "@/lib/types";
import { LeadForm } from "./lead-form";
import { ProgramIcon } from "./icons";
import { useSite } from "./site-context";
import { Badges, UniLogo } from "./university-card";

function Shell({
  eyebrow,
  title,
  subtitle,
  icon,
  wide,
  onClose,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  wide?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/60 p-3 animate-fade sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-pop ${wide ? "max-w-4xl" : "max-w-md"}`}
      >
        <div className="relative shrink-0 bg-navy px-6 pb-5 pt-5 text-white">
          {eyebrow && (
            <span className={eyebrow.startsWith("OFFICIAL") ? "text-[11px] font-bold tracking-wider text-white/80" : "inline-block rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold tracking-wider"}>
              {eyebrow}
            </span>
          )}
          <h2 className="mt-2 flex items-center gap-2 pr-10 font-display text-xl font-bold leading-snug">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-[13px] text-white/75">{subtitle}</p>}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function Modals() {
  const { modal, closeModal } = useSite();
  if (!modal) return null;
  switch (modal.type) {
    case "lead":
      return (
        <Shell eyebrow="FREE EXPERT COUNSELING" title={modal.title} onClose={closeModal}>
          <LeadForm source={modal.source} universityId={modal.universityId} onDone={closeModal} />
        </Shell>
      );
    case "fees":
      return <FeeModal id={modal.universityId} />;
    case "compare":
      return <CompareModal />;
    case "quiz":
      return <QuizModal />;
  }
}

function FeeModal({ id }: { id: string }) {
  const { byId, closeModal, openModal } = useSite();
  const u = byId.get(id);
  if (!u) return null;
  return (
    <Shell eyebrow="OFFICIAL FEE STRUCTURE" title={u.name} onClose={closeModal}>
      <Badges u={u} wes />
      <p className="mt-4 text-[13px] text-slate-600">
        <b className="text-slate-800">Programs Available:</b> {u.programNames.join(", ") || u.featuredProgram}
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 text-[14px]">
        <div className="flex justify-between gap-3 bg-slate-50 px-4 py-3 text-[12.5px] font-semibold text-slate-700">
          <span>Fee Component ({u.featuredProgram})</span>
          <span className="shrink-0">Amount (INR)</span>
        </div>
        <Row k="Per Semester Tuition Fee" v={inr(u.semesterFee)} />
        <Row k="Zero-Cost Monthly EMI Option" v={`${inr(u.emiPerMonth)} / month`} green />
        <div className="flex justify-between gap-3 bg-slate-50 px-4 py-3.5 font-bold text-slate-900">
          <span>Complete Program Total Fee</span>
          <span className="font-display text-lg">{inr(u.totalFee)}</span>
        </div>
      </div>

      {u.highlights.length > 0 && (
        <>
          <p className="mt-5 text-[12px] font-bold uppercase tracking-wider text-slate-500">University Key Highlights</p>
          <ul className="mt-2 space-y-1.5 text-[13.5px] text-slate-700">
            {u.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600" /> {h}
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-3 flex gap-2 text-[13.5px] text-slate-700">
        <Briefcase className="mt-0.5 size-4 shrink-0 text-brand" />
        <span>
          <b>Top Recruiters:</b> {u.hiringPartners}
        </span>
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => openModal({ type: "lead", title: `${u.name} – Brochure`, source: "brochure", universityId: u.id })}
          className="btn-brand flex-1 text-sm"
        >
          Download Official Brochure
        </button>
        <button onClick={closeModal} className="rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Close
        </button>
      </div>
    </Shell>
  );
}

function Row({ k, v, green }: { k: string; v: string; green?: boolean }) {
  return (
    <div className="flex justify-between gap-3 border-t border-slate-100 px-4 py-3">
      <span className="text-slate-600">{k}</span>
      <span className={`shrink-0 font-bold ${green ? "text-green-700" : "text-slate-900"}`}>{v}</span>
    </div>
  );
}

function CompareModal() {
  const { compare, byId, closeModal, openModal } = useSite();
  const list = compare.map((id) => byId.get(id)).filter(Boolean) as UniversityDTO[];

  const rows: { label: string; render: (u: UniversityDTO) => React.ReactNode }[] = [
    { label: "Location", render: (u) => `${u.city}, ${u.state}` },
    {
      label: "Approvals & NAAC",
      render: (u) => (
        <span className="font-semibold text-green-700">
          {["UGC-DEB", u.naacGrade && `NAAC ${u.naacGrade}`, u.nirfRank && `NIRF ${u.nirfRank}`, u.wesAccredited && "WES Accredited"]
            .filter(Boolean)
            .join(", ")}
        </span>
      ),
    },
    { label: "Featured Program", render: (u) => <span className="font-medium">{u.featuredProgram}</span> },
    { label: "Total Course Fee", render: (u) => <span className="font-display text-lg font-extrabold">{inr(u.totalFee)}</span> },
    { label: "Per Semester Fee", render: (u) => `${inr(u.semesterFee)} / Sem` },
    { label: "No-Cost EMI Starts", render: (u) => <span className="font-bold text-green-700">{inr(u.emiPerMonth)} / month</span> },
    { label: "Exam Mode", render: (u) => u.examMode },
    { label: "Key Specializations", render: (u) => <span className="text-[13px]">{u.specializations}</span> },
    { label: "Top Hiring Partners", render: (u) => <span className="text-[13px]">{u.hiringPartners}</span> },
  ];

  return (
    <Shell
      wide
      title="Side-by-Side University Comparison"
      subtitle="Bharat Global Education Unbiased Comparison Matrix"
      icon={<Scale className="size-5 shrink-0 text-brand" />}
      onClose={closeModal}
    >
      <div className="-mx-6 -my-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-10 w-36 bg-white px-4 py-4" />
              {list.map((u) => (
                <th key={u.id} className="px-4 py-4 align-top">
                  <div className="flex items-center gap-2.5">
                    <UniLogo u={u} size="sm" />
                    <div>
                      <p className="font-display text-[14px] font-bold leading-tight text-navy">{u.name}</p>
                      {u.naacGrade && <p className="mt-0.5 text-[11px] font-semibold text-green-700">NAAC {u.naacGrade}</p>}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-slate-100">
                <th scope="row" className="sticky left-0 z-10 bg-slate-50 px-4 py-3.5 text-[12.5px] font-semibold text-slate-600">
                  {r.label}
                </th>
                {list.map((u) => (
                  <td key={u.id} className="px-4 py-3.5 align-top text-slate-800">
                    {r.render(u)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="sticky left-0 z-10 bg-slate-50 px-4 py-4 text-[12.5px] font-semibold text-slate-600">Action</th>
              {list.map((u) => (
                <td key={u.id} className="px-4 py-4">
                  <button
                    onClick={() => openModal({ type: "lead", title: u.name, source: "apply", universityId: u.id })}
                    className="btn-brand w-full py-2.5 text-sm"
                  >
                    Apply to {u.initials}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

const BUDGET_OPTS = [
  { label: "Under ₹1 Lakh", max: 100000 },
  { label: "₹1 – 1.5 Lakh", max: 150000 },
  { label: "₹1.5 – 2.5 Lakh", max: 250000 },
  { label: "No budget limit", max: Infinity },
];
const PRIORITIES = [
  { key: "brand", label: "Top ranking & brand value" },
  { key: "fee", label: "Lowest total fee" },
  { key: "emi", label: "Lowest monthly EMI" },
] as const;

function QuizModal() {
  const { programs, universities, closeModal, openModal, toggleCompare, compare } = useSite();
  const [step, setStep] = useState(0);
  const [program, setProgram] = useState<string | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number]["key"] | null>(null);

  const matches = useMemo(() => {
    if (step < 3) return [];
    const nirf = (u: UniversityDTO) => Number(u.nirfRank?.replace(/\D/g, "")) || 999;
    let list = universities.filter((u) => !program || u.programSlugs.includes(program));
    const inBudget = list.filter((u) => u.totalFee <= (budget ?? Infinity));
    if (inBudget.length) list = inBudget;
    list = [...list].sort((a, b) =>
      priority === "fee" ? a.totalFee - b.totalFee : priority === "emi" ? a.emiPerMonth - b.emiPerMonth : nirf(a) - nirf(b) || b.popularity - a.popularity,
    );
    return list.slice(0, 3);
  }, [step, universities, program, budget, priority]);

  const Option = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[14px] font-semibold transition ${
        active ? "border-navy bg-navy text-white" : "border-slate-200 hover:border-navy/50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <Shell
      eyebrow="30-SECOND UNIVERSITY FINDER"
      title={step < 3 ? ["Which program do you want?", "What's your total budget?", "What matters most to you?"][step] : "Your Best-Fit Universities"}
      icon={<Sparkles className="size-5 shrink-0 text-brand" />}
      onClose={closeModal}
    >
      {step < 3 && (
        <div className="mb-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-slate-200"}`} />
          ))}
        </div>
      )}

      {step === 0 && (
        <div className="grid gap-2">
          {programs.map((p) => (
            <Option key={p.slug} active={program === p.slug} onClick={() => { setProgram(p.slug); setStep(1); }}>
              <ProgramIcon name={p.icon} className="size-4 text-brand" /> {p.name}
              <span className="ml-auto text-[12px] font-medium opacity-60">{p.duration}</span>
            </Option>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="grid gap-2">
          {BUDGET_OPTS.map((b) => (
            <Option key={b.label} active={budget === b.max} onClick={() => { setBudget(b.max); setStep(2); }}>
              {b.label}
            </Option>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-2">
          {PRIORITIES.map((p) => (
            <Option key={p.key} active={priority === p.key} onClick={() => { setPriority(p.key); setStep(3); }}>
              {p.label}
            </Option>
          ))}
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          {matches.length === 0 && <p className="text-sm text-slate-600">No exact match — talk to an expert for options.</p>}
          {matches.map((u, i) => (
            <div key={u.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
              <UniLogo u={u} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-bold text-navy">
                  {i === 0 && <span className="mr-1 text-brand">★</span>}
                  {u.name}
                </p>
                <p className="text-[12.5px] text-slate-500">
                  {inr(u.totalFee)} · EMI {inr(u.emiPerMonth)}/mo
                </p>
              </div>
              <button
                onClick={() => toggleCompare(u.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${compare.includes(u.id) ? "bg-navy text-white" : "border border-slate-200"}`}
              >
                {compare.includes(u.id) ? "Added" : "Compare"}
              </button>
            </div>
          ))}
          <button
            onClick={() => openModal({ type: "lead", title: "Get Expert Advice on Your Matches", source: "quiz" })}
            className="btn-brand w-full"
          >
            Get Free Expert Counseling
          </button>
        </div>
      )}

      {step > 0 && (
        <button onClick={() => setStep((s) => s - 1)} className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-navy">
          <ArrowLeft className="size-4" /> Back
        </button>
      )}
    </Shell>
  );
}
