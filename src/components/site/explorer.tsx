"use client";

import { useMemo, useState } from "react";
import { Award, BadgeCheck, Building2, CreditCard, LayoutGrid, RotateCcw, Search } from "lucide-react";
import { ProgramIcon } from "./icons";
import { useSite } from "./site-context";
import { UniversityCard } from "./university-card";

const BUDGETS = [
  { value: "all", label: "All Fee Budgets", test: () => true },
  { value: "lt1l", label: "Under ₹1,00,000 Total Fee", test: (f: number) => f < 100000 },
  { value: "1to15", label: "₹1,00,000 – ₹1,50,000", test: (f: number) => f >= 100000 && f <= 150000 },
  { value: "gt15", label: "Above ₹1,50,000", test: (f: number) => f > 150000 },
] as const;

const SORTS = [
  { value: "popularity", label: "Sort: Popularity" },
  { value: "fee-asc", label: "Fees: Low to High" },
  { value: "fee-desc", label: "Fees: High to Low" },
] as const;

type Budget = (typeof BUDGETS)[number]["value"];
type Sort = (typeof SORTS)[number]["value"];

const TRUST = [
  { icon: BadgeCheck, text: "100% UGC-DEB Entitled", color: "text-green-600" },
  { icon: Award, text: "NAAC A++ / A+ Accredited", color: "text-brand" },
  { icon: CreditCard, text: "0% Interest EMI Available", color: "text-navy" },
  { icon: Building2, text: "Dedicated Placement Cell", color: "text-green-600" },
];

export function Explorer() {
  const { universities, programs } = useSite();
  const [program, setProgram] = useState("all");
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState<Budget>("all");
  const [sort, setSort] = useState<Sort>("popularity");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const budgetTest = BUDGETS.find((b) => b.value === budget)!.test;
    const list = universities.filter((u) => {
      if (program !== "all" && !u.programSlugs.includes(program)) return false;
      if (!budgetTest(u.totalFee)) return false;
      if (!q) return true;
      return [u.name, u.shortName, u.city, u.state, u.featuredProgram, u.specializations, ...u.courseTags, ...u.programNames]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    if (sort === "fee-asc") list.sort((a, b) => a.totalFee - b.totalFee);
    else if (sort === "fee-desc") list.sort((a, b) => b.totalFee - a.totalFee);
    else list.sort((a, b) => b.popularity - a.popularity);
    return list;
  }, [universities, program, query, budget, sort]);

  const reset = () => {
    setProgram("all");
    setQuery("");
    setBudget("all");
    setSort("popularity");
  };

  const chips = [{ slug: "all", name: "All Programs", icon: "LayoutGrid" }, ...programs];

  return (
    <section id="universities" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-bold uppercase tracking-wider text-slate-600">1. Select your degree / program:</p>
        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-700">
          Showing {results.length} {results.length === 1 ? "University" : "Universities"}
        </span>
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {chips.map((c) => {
          const active = program === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => setProgram(c.slug)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[13px] font-semibold transition ${
                active ? "border-navy bg-navy text-white shadow" : "border-slate-200 bg-white text-slate-700 hover:border-navy/40"
              }`}
            >
              {c.slug === "all" ? (
                <LayoutGrid className="size-4" />
              ) : (
                <ProgramIcon name={c.icon} className={`size-4 ${active ? "" : "text-brand"}`} />
              )}
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_220px_200px_auto]">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search university, course, or specialization"
            className="field pl-10"
          />
        </label>
        <select aria-label="Fee budget" value={budget} onChange={(e) => setBudget(e.target.value as Budget)} className="field">
          {BUDGETS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button onClick={reset} className="field flex items-center justify-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 md:w-auto">
          <RotateCcw className="size-4" /> Reset
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {TRUST.map(({ icon: Icon, text, color }) => (
          <div key={text} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-3 text-[12.5px] font-medium text-slate-700">
            <Icon className={`size-5 shrink-0 ${color}`} /> {text}
          </div>
        ))}
      </div>

      {results.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((u) => (
            <UniversityCard key={u.id} u={u} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-800">No universities match these filters.</p>
          <button onClick={reset} className="btn-navy mt-4 text-sm">
            <RotateCcw className="size-4" /> Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
